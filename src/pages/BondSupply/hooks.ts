import { useQuery } from 'react-query'
import { getPegCurrency } from '../../constants'
import { TokenInfo } from '@uniswap/token-lists'
import { BigNumber } from '@ethersproject/bignumber'
import { utils } from 'ethers'
import { TokenInfoWithCoingeckoId } from '../../utils'
import {
  ChainId,
  getHourlyBondBalances,
  getHourlyBondInterestRates,
  getHourlyBondIncentiveInterestRates,
  getHourlyBondMaturities,
  getBondsCostInDollars,
  TokenAmount,
  getTokenAllowances,
  getTokenBalance,
  Token
} from '@marginswap/sdk'

interface MarketDataProps {
  chainId?: ChainId | undefined
  provider?: any | undefined
  tokens?: TokenInfoWithCoingeckoId[]
  account: string | null | undefined
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
export const useMarketData = ({ chainId, tokens, provider, account }: MarketDataProps) => {
  const bondAPRs = useQuery('getBondAPRs', async () => {
    if (!tokens?.length || !provider) return null

    const interestRates = await getHourlyBondInterestRates(
      tokens.map(t => t.address),
      chainId,
      provider
    )

    return await Object.keys(interestRates).reduce(
      (acc, cur) => ({ ...acc, [cur]: BigNumber.from(interestRates[cur]).toNumber() / 100 }),
      {}
    )
  })

  const incentiveAPRs = useQuery('getIncentiveAPRs', async () => {
    if (!tokens?.length || !provider || !chainId) return null

    const interestRates = await getHourlyBondIncentiveInterestRates(
      tokens.map(t => new Token(chainId, t.address, t.decimals, t.symbol, t.name, t.coingeckoId)),
      chainId,
      provider,

    )

    return await Object.keys(interestRates).reduce(
      (acc, cur) => ({ ...acc, [cur]: BigNumber.from(interestRates[cur]).toNumber() / 100 }),
      {}
    )
  })

  const bondMaturities = useQuery('getBondMaturities', async () => {
    if (!account || !tokens?.length || !provider) return null

    const maturities = await getHourlyBondMaturities(
      account,
      tokens.map(t => t.address),
      chainId,
      provider
    )

    return await Object.keys(maturities).reduce(
      (acc, cur) => ({ ...acc, [cur]: Math.ceil(BigNumber.from(maturities[cur]).toNumber() / 60) }),
      {}
    )
  })

  const bondUSDCosts = useQuery('getBondUSDCosts', async () => {
    if (!account || !tokens?.length || !provider) return null
    const pegCurrency = getPegCurrency(chainId)
    const bondCosts = await getBondsCostInDollars(
      account,
      tokens.map(t => t.address),
      chainId,
      provider
    )

    return await Object.keys(bondCosts).reduce(
      (acc, cur) => ({ ...acc, [cur]: new TokenAmount(pegCurrency, bondCosts[cur].toString()) }),
      {}
    )
  })

  return { bondAPRs, incentiveAPRs, bondMaturities, bondUSDCosts }
}

/**
 *
 *
 * Get User MarginSwap Data
 * @description fetches the data that does not need to be polled because the app knows when it changes
 *
 */
export const useUserMarginswapData = ({ chainId, tokens, provider, account }: UserMarginswapDataProps) => {
  const bondBalances = useQuery('getBondBalances', async () => {
    if (!tokens?.length || !provider || !account) return null

    const balances = await getHourlyBondBalances(
      account,
      tokens.map(t => t.address),
      chainId,
      provider
    )

    return await Object.keys(balances).reduce(
      (acc, cur) => ({ ...acc, [cur]: BigNumber.from(balances[cur]).toString() }),
      {}
    )
  })

  const allowances = useQuery('getAllowances', async () => {
    if (!chainId || !tokens?.length || !provider || !account) return null

    const allowancesTokens = await getTokenAllowances(
      account,
      tokens.map(t => t.address),
      chainId,
      provider
    )

    return await allowancesTokens.reduce(
      (acc: any, cur: any, index: number) => ({
        ...acc,
        [tokens[index].address]: Number(BigNumber.from(cur).toString())
      }),
      {}
    )
  })

  const tokenBalances = useQuery('getTokenBalances', async () => {
    if (!chainId || !tokens?.length || !provider || !account) return null

    const tokenBalancesRetrieve = await Promise.all(
      tokens.map(token => getTokenBalance(account, token.address, provider))
    )

    return await tokenBalancesRetrieve.reduce(
      (acc, cur, index) => ({
        ...acc,
        [tokens[index].address]: Number(
          utils.formatUnits(tokenBalancesRetrieve[index].toString(), tokens[index].decimals)
        )
      }),
      {}
    )
  })

  return { bondBalances, allowances, tokenBalances }
}
