import { UNI, getPegCurrency } from '../../constants/index'
import {
  Currency,
  CurrencyAmount,
  ETHER,
  JSBI,
  Token,
  TokenAmount,
  borrowableInPeg,
  LeverageType,
  getHoldingAmounts,
  viewCurrentPriceInPeg,
  ChainId,
  totalLendingAvailable,
  Balances
} from '@marginswap/sdk'
import { useMemo, useState, useEffect, useCallback } from 'react'
import ERC20_INTERFACE from '../../constants/abis/erc20'
import { useAllTokens } from '../../hooks/Tokens'
import { useActiveWeb3React } from '../../hooks'
import { useMulticallContract } from '../../hooks/useContract'
import { isAddress } from '../../utils'
import { useSingleContractMultipleData, useMultipleContractSingleData } from '../multicall/hooks'
import { useUserUnclaimedAmount } from '../claim/hooks'
import { useTotalUniEarned } from '../stake/hooks'
import { useSwapState } from '../swap/hooks'
import { getProviderOrSigner } from '../../utils'
import usePrevious from '../../hooks/usePrevious'
import { wrappedCurrency } from 'utils/wrappedCurrency'
import { parseUnits } from 'ethers/lib/utils'
import { BigNumber, utils } from 'ethers'
import { TokenInfo } from '@uniswap/token-lists'
import isEqual from 'lodash.isequal'

/**
 * Returns a map of the given addresses to their eventually consistent ETH balances.
 */
export function useETHBalances(uncheckedAddresses?: (string | undefined)[]): {
  [address: string]: CurrencyAmount | undefined
} {
  const multicallContract = useMulticallContract()

  const addresses: string[] = useMemo(
    () =>
      uncheckedAddresses
        ? uncheckedAddresses
            .map(isAddress)
            .filter((a): a is string => a !== false)
            .sort()
        : [],
    [uncheckedAddresses]
  )

  const results = useSingleContractMultipleData(
    multicallContract,
    'getEthBalance',
    addresses.map(address => [address])
  )

  return useMemo(
    () =>
      addresses.reduce<{ [address: string]: CurrencyAmount }>((memo, address, i) => {
        const value = results?.[i]?.result?.[0]
        if (value) memo[address] = CurrencyAmount.ether(JSBI.BigInt(value.toString()))
        return memo
      }, {}),
    [addresses, results]
  )
}

export async function valueInPeg2token(
  valueInPeg: TokenAmount,
  wrapped: Token,
  chainId: ChainId,
  provider: any
): Promise<BigNumber | undefined> {
  const hundred = `100${'0'.repeat(wrapped.decimals)}`
  const curPrice = await viewCurrentPriceInPeg(wrapped.address, hundred, chainId, provider)

  const pegCurrency = getPegCurrency(chainId)
  if (pegCurrency && curPrice.gt(0)) {
    const valueInTarget = valueInPeg.multiply(`100${'0'.repeat(pegCurrency.decimals)}`).divide(curPrice.toString())
    return parseUnits(valueInTarget.toFixed(wrapped.decimals), wrapped.decimals)
  } else {
    return undefined
  }
}

export function useBorrowable(currency: Currency | undefined): CurrencyAmount | undefined {
  const { library, chainId, account } = useActiveWeb3React()
  const provider: any = getProviderOrSigner(library!)
  const [balance, setBalance] = useState<CurrencyAmount | undefined>(undefined)

  const updateBorrowableBalance = useCallback(async () => {
    const pegCurrency = getPegCurrency(chainId)
    if (chainId && currency && account && pegCurrency) {
      const bip = await borrowableInPeg(account, chainId, provider)

      if (bip) {
        const borrowableInPeg = new TokenAmount(pegCurrency, bip)

        const wrapped = wrappedCurrency(currency, chainId)

        if (wrapped) {
          const borrowableInTarget = await valueInPeg2token(borrowableInPeg, wrapped, chainId, provider)
          if (borrowableInTarget) {
            const result =
              currency.name == 'Ether'
                ? CurrencyAmount.ether(borrowableInTarget.toString())
                : new TokenAmount(wrapped, borrowableInTarget.toString())

            setBalance(result)
          } else {
            setBalance(undefined)
          }
        } else {
          setBalance(undefined)
        }
      }
    }
  }, [currency, setBalance])

  useEffect(() => {
    updateBorrowableBalance()
  }, [currency, updateBorrowableBalance])
  return balance
}

export function useHoldingAmounts({ address, chainId, provider }: any): Balances | undefined {
  const [holdingAmounts, setHoldingAmounts] = useState<Balances | undefined>()
  const previousHoldingAmounts = usePrevious(holdingAmounts)

  const updateHoldingAmounts = async () => {
    const holdings: Balances = await getHoldingAmounts(address, chainId, provider as any)

    if (holdings && !isEqual(holdings, previousHoldingAmounts)) {
      setHoldingAmounts(holdings)
    }
  }

  updateHoldingAmounts()

  return holdingAmounts
}

export function useMarginBalance({ address, validatedTokens }: any) {
  const [balances, setBalances] = useState({})
  const { library, chainId } = useActiveWeb3React()
  const previousValidatedTokens = usePrevious(validatedTokens)
  const provider = getProviderOrSigner(library!, address)
  const holdingAmounts = useHoldingAmounts({ address, chainId, provider })
  const previousHoldingAmounts = usePrevious(holdingAmounts)

  const updateMarginBalances = () => {
    if (holdingAmounts && address && chainId && validatedTokens.length > 0) {
      const memo: { [tokenAddress: string]: TokenAmount } = {}
      validatedTokens.forEach((token: Token) => {
        const balanceValue = JSBI.BigInt(holdingAmounts[token.address] ?? 0)
        memo[token.address] = new TokenAmount(token, balanceValue)
      })
      setBalances(memo)
    }
  }

  useEffect(() => {
    if (!isEqual(validatedTokens, previousValidatedTokens) || !isEqual(holdingAmounts, previousHoldingAmounts)) {
      updateMarginBalances()
    }
  }, [address, library, validatedTokens, holdingAmounts])
  return balances
}

/**
 * Returns a map of token addresses to their eventually consistent token balances for a single account.
 */
export function useTokenBalancesWithLoadingIndicator(
  address?: string,
  tokens?: (Token | undefined)[]
): [{ [tokenAddress: string]: TokenAmount | undefined }, boolean] {
  const validatedTokens: Token[] = useMemo(
    () => tokens?.filter((t?: Token): t is Token => isAddress(t?.address) !== false) ?? [],
    [tokens]
  )
  const validatedTokenAddresses = useMemo(() => validatedTokens.map(vt => vt.address), [validatedTokens])
  const balances = useMultipleContractSingleData(validatedTokenAddresses, ERC20_INTERFACE, 'balanceOf', [address])
  const anyLoading: boolean = useMemo(() => balances.some(callState => callState.loading), [balances])
  const marginBalances = useMarginBalance({ address, validatedTokens })
  const { leverageType } = useSwapState()

  return [
    address && validatedTokens.length > 0
      ? leverageType === LeverageType.CROSS_MARGIN
        ? marginBalances
        : validatedTokens.reduce<{ [tokenAddress: string]: TokenAmount | undefined }>((memo, token, i) => {
            const value = balances?.[i]?.result?.[0]
            const amount = value ? JSBI.BigInt(value.toString()) : undefined
            if (amount) {
              memo[token.address] = new TokenAmount(token, amount)
            }
            return memo
          }, {})
      : {},
    anyLoading
  ]
}

export function useTokenBalances(
  address?: string,
  tokens?: (Token | undefined)[]
): { [tokenAddress: string]: TokenAmount | undefined } {
  return useTokenBalancesWithLoadingIndicator(address, tokens)[0]
}

// get the balance for a single token/account combo
export function useTokenBalance(account?: string, token?: Token): TokenAmount | undefined {
  const tokenBalances = useTokenBalances(account, [token])
  if (!token) return undefined
  return tokenBalances[token.address]
}

export function useCurrencyBalances(
  account?: string,
  currencies?: (Currency | undefined)[]
): (CurrencyAmount | undefined)[] {
  const tokens = useMemo(
    () => currencies?.filter((currency): currency is Token => currency instanceof Token) ?? [],
    [currencies]
  )

  const tokenBalances = useTokenBalances(account, tokens)
  const containsETH: boolean = useMemo(() => currencies?.some(currency => currency === ETHER) ?? false, [currencies])
  const ethBalance = useETHBalances(containsETH ? [account] : [])

  return (
    currencies?.map(currency => {
      if (!account || !currency) return undefined
      if (currency instanceof Token) return tokenBalances[currency.address]
      if (currency === ETHER) return ethBalance[account]
      return undefined
    }) ?? []
  )
}

export function useCurrencyBalance(account?: string, currency?: Currency): CurrencyAmount | undefined {
  return useCurrencyBalances(account, [currency])[0]
}

// mimics useAllBalances
export function useAllTokenBalances(): { [tokenAddress: string]: TokenAmount | undefined } {
  const { account } = useActiveWeb3React()
  const allTokens = useAllTokens()
  const allTokensArray = useMemo(() => Object.values(allTokens ?? {}), [allTokens])
  const balances = useTokenBalances(account ?? undefined, allTokensArray)
  return balances ?? {}
}

// get the total owned, unclaimed, and unharvested UNI for account
export function useAggregateUniBalance(): TokenAmount | undefined {
  const { account, chainId } = useActiveWeb3React()

  const uni = chainId === ChainId.MAINNET ? UNI[ChainId.MAINNET] : undefined

  const uniBalance: TokenAmount | undefined = useTokenBalance(account ?? undefined, uni)
  const uniUnclaimed: TokenAmount | undefined = useUserUnclaimedAmount(account)
  const uniUnHarvested: TokenAmount | undefined = useTotalUniEarned()

  if (!uni) return undefined

  return new TokenAmount(
    uni,
    JSBI.add(
      JSBI.add(uniBalance?.raw ?? JSBI.BigInt(0), uniUnclaimed?.raw ?? JSBI.BigInt(0)),
      uniUnHarvested?.raw ?? JSBI.BigInt(0)
    )
  )
}

// get the total amount of liquidity / lending that is available for a given token
export function useLendingAvailable(
  chainId: number | undefined,
  token: TokenInfo | undefined,
  provider: any
): CurrencyAmount | undefined {
  const [lendingAvailable, setLendingAvailable] = useState<CurrencyAmount | undefined>()

  const getLendingAvailable = async () => {
    if (!chainId || !token) return
    const tokenToken = new Token(chainId, token.address, token.decimals)
    const result = ((await totalLendingAvailable(token.address, chainId, provider)) ?? utils.parseUnits('0')).toString()

    setLendingAvailable(new TokenAmount(tokenToken, result))
  }

  useEffect(() => {
    if (chainId && token && provider) {
      getLendingAvailable()
    }
  }, [token?.symbol])

  return lendingAvailable
}
