import { useQuery } from 'react-query'
import { getPegCurrency, USDT_MAINNET } from '../../constants'
import { TokenInfo } from '@uniswap/token-lists'
import { BigNumber } from '@ethersproject/bignumber'
import {
  ChainId,
  getHourlyBondBalances,
  getHourlyBondInterestRates,
  getHourlyBondMaturities,
  buyHourlyBondSubscription,
  getBondsCostInDollars,
  withdrawHourlyBond,
  approveToFund,
  TokenAmount,
  getTokenAllowances,
  getTokenBalance
} from '@marginswap/sdk'

interface MarketDataProps {
  chainId?: ChainId | undefined
  provider?: any | undefined
  tokens?: TokenInfo[]
  account: string | null | undefined
}

export const useMarketData = ({ chainId, tokens, provider, account }: MarketDataProps) => {
  const pegCurrency = getPegCurrency(chainId)

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
  console.log('🚀 ~ file: hooks.ts ~ line 43 ~ bondAPRs ~ bondAPRs', bondAPRs.data)

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

  return { bondAPRs, bondMaturities, bondUSDCosts }
}
