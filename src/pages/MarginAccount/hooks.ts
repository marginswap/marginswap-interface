import { useQuery } from 'react-query'
import { getPegCurrency, USDT_MAINNET } from '../../constants'
import { TokenInfo } from '@uniswap/token-lists'
import { BigNumber } from '@ethersproject/bignumber'
import { utils } from 'ethers'
import {
  ChainId,
  Token,
  getBorrowInterestRates,
  totalLendingAvailable,
  getAccountHoldingTotal,
  getAccountBorrowTotal,
  TokenAmount,
  getTokenAllowances,
  getTokenBalance,
  getAccountBalances,
  borrowableInPeg,
  withdrawableInPeg
} from '@marginswap/sdk'
import { valueInPeg2token } from 'state/wallet/hooks'

interface MarketDataProps {
  chainId?: ChainId | undefined
  provider?: any | undefined
  tokens?: TokenInfo[]
}

interface UserMarginswapDataProps {
  chainId?: ChainId | undefined
  provider?: any | undefined
  tokens?: TokenInfo[]
  account: string | null | undefined
}

/**
 *
 *
 * Get market data
 * @description fetches the data related to the MarginSwap market via polling
 *
 */
export const useMarketData = ({ chainId, tokens, provider }: MarketDataProps) => {
  // interest rates by token
  const borrowAPRs = useQuery('getBorrowAPRs', async () => {
    if (!tokens?.length || !provider) return null

    const interestRates = await getBorrowInterestRates(
      tokens.map(token => token.address),
      chainId,
      provider
    )

    return Object.keys(interestRates).reduce(
      (acc, cur) => ({ ...acc, [cur]: BigNumber.from(interestRates[cur]).toNumber() * 0.01 }),
      {}
    )
  })

  // liquidities (max lending available by token)
  const liquidities = useQuery('getLiquidities', async () => {
    if (!chainId || !tokens?.length || !provider) return null

    const liquiditiesRetreived = await Promise.all(
      tokens.map(async token => {
        const tokenToken = new Token(chainId, token.address, token.decimals)
        return new TokenAmount(
          tokenToken,
          ((await totalLendingAvailable(token.address, chainId, provider)) ?? utils.parseUnits('0')).toString()
        )
      })
    )

    return liquiditiesRetreived.reduce((acc, cur, index) => ({ ...acc, [tokens[index].address]: cur }), {})
  })

  return { borrowAPRs, liquidities }
}

/**
 *
 *
 * Get User MarginSwap Data
 * @description fetches the data that does not need to be polled because the app knows when it changes
 *
 */
export const useUserMarginswapData = ({ chainId, tokens, provider, account }: UserMarginswapDataProps) => {
  //borrowable and holding amounts
  const amounts = useQuery('getBalances', async () => {
    if (!account || !chainId || !provider) return null

    const balancesRetreived = await getAccountBalances(account, chainId, provider)

    const holdingAmounts = await Object.keys(balancesRetreived.holdingAmounts).reduce(
      (acc, cur) => ({ ...acc, [cur]: BigNumber.from(balancesRetreived.holdingAmounts[cur]).toString() }),
      {}
    )

    const borrowingAmounts = await Object.keys(balancesRetreived.borrowingAmounts).reduce(
      (acc, cur) => ({ ...acc, [cur]: BigNumber.from(balancesRetreived.borrowingAmounts[cur]).toString() }),
      {}
    )

    return { holdingAmounts, borrowingAmounts }
  })

  const allowances = useQuery('getAllowances', async () => {
    if (!account || !chainId || !provider || !tokens?.length) return null
    const allowancesRetreived = await getTokenAllowances(
      account,
      tokens.map(token => token.address),
      chainId,
      provider
    )

    return await allowancesRetreived.reduce(
      (acc: any, cur: any, index: number) => ({
        ...acc,
        [tokens[index].address]: Number(BigNumber.from(cur).toString())
      }),
      {}
    )
  })

  const borrowableAmounts = useQuery('getBorrowableAmounts', async () => {
    if (!account || !chainId || !provider || !tokens?.length) return null
    const borrowableAmountsRetreive = await Promise.all(
      tokens.map(async token => {
        const tokenToken = new Token(chainId, token.address, token.decimals)
        const bipString = await borrowableInPeg(account, chainId, provider)
        const bip = new TokenAmount(getPegCurrency(chainId) ?? USDT_MAINNET, bipString)

        if (bip) {
          return new TokenAmount(
            tokenToken,
            ((await valueInPeg2token(bip, tokenToken, chainId, provider)) ?? utils.parseUnits('0')).toString()
          )
        } else {
          return new TokenAmount(tokenToken, '0')
        }
      })
    )

    return await borrowableAmountsRetreive.reduce((acc, cur, index) => ({ ...acc, [tokens[index].address]: cur }), {})
  })

  const withdrawableAmounts = useQuery('getWithdrawableAmounts', async () => {
    if (!account || !chainId || !provider || !tokens?.length) return null

    const withdrableAmountsRetreived = await Promise.all(
      tokens.map(async token => {
        const tokenToken = new Token(chainId, token.address, token.decimals)
        const wipString = await withdrawableInPeg(account, chainId, provider)
        const wip = new TokenAmount(getPegCurrency(chainId) ?? USDT_MAINNET, wipString)

        if (wip) {
          const tokenAmount = (
            (await valueInPeg2token(wip, tokenToken, chainId, provider)) ?? utils.parseUnits('0')
          ).toString()

          return new TokenAmount(tokenToken, tokenAmount)
        } else {
          return new TokenAmount(tokenToken, '0')
        }
      })
    )

    return await withdrableAmountsRetreived.reduce((acc, cur, index) => ({ ...acc, [tokens[index].address]: cur }), {})
  })

  const tokenBalances = useQuery('getTokenBalances', async () => {
    if (!account || !chainId || !provider || !tokens?.length) return null

    const tokenBalancesRetreived = await Promise.all(
      tokens.map(token => getTokenBalance(account, token.address, provider))
    )

    return await tokenBalancesRetreived.reduce(
      (acc, cur, index) => ({
        ...acc,
        [tokens[index].address]: Number(
          utils.formatUnits(tokenBalancesRetreived[index].toString(), tokens[index].decimals)
        )
      }),
      {}
    )
  })

  const holdingTotal = useQuery('getHoldingTotal', async () => {
    if (!account || !chainId || !provider || !tokens?.length) return null

    return await new TokenAmount(
      getPegCurrency(chainId) ?? USDT_MAINNET,
      (await getAccountHoldingTotal(account, chainId, provider)).toString()
    )
  })

  const debtTotal = useQuery('getDebtTotal', async () => {
    if (!account || !chainId || !provider || !tokens?.length) return null

    return await new TokenAmount(
      getPegCurrency(chainId) ?? USDT_MAINNET,
      (await getAccountBorrowTotal(account, chainId, provider)).toString()
    )
  })

  return { amounts, allowances, borrowableAmounts, withdrawableAmounts, tokenBalances, holdingTotal, debtTotal }
}
