import axiosInstance from '../../config/axios-config'
import { DateTime } from 'luxon'
import groupby from 'lodash.groupby'
import tokenListMarginSwap from '../../constants/tokenLists/marginswap-default.tokenlist.json'
import { AVALANCHE_TOKENS_LIST } from '../../constants'
import { TokenAmount, Token } from '@marginswap/sdk'
import transform from 'lodash.transform'

import legacyAvalancheData from '../../data/legacy-data/avalanche-aug-2021.json'
interface TokensValue {
  [key: string]: { usd: number }
}

export interface IAggregateBalance {
  balance: string
  balanceType: string
  id: string
  token: string
  createdAt: string
  contract: string
  updatedAt: string | null
}

export interface ISwap {
  fromAmount: string
  fromToken: string
  id: string
  trader: string
  createdAt: string
}

type TopTradersProps = {
  trader: string
  volume: number
}

export type VolumeSwaps = {
  polygonData: ISwap[]
  avalancheData: ISwap[]
  bscData: ISwap[]
  ethData: ISwap[]
}

export type SwapVolumeProps = {
  id: string
  createdAt: string
  token: string
  volume: string
  type: string
  updatedAt: string | null
}

export type GetAggregateBalancesProps = {
  aggregateBalancesPolygon: IAggregateBalance[]
  aggregateBalancesAvalanche: IAggregateBalance[]
  aggregateBalancesBsc: IAggregateBalance[]
  aggregateBalancesEth: IAggregateBalance[]
}

export type GetDailyVolumeProps = {
  dailyPolygonSwapVolumes: SwapVolumeProps[]
  dailyAvalancheSwapVolumes: SwapVolumeProps[]
  dailyBscSwapVolumes: SwapVolumeProps[]
  dailyEthSwapVolumes: SwapVolumeProps[]
}

async function lowerCaseObjectKey(object: any) {
  return transform(object, (result: any, val, key: string): any => (result[key.toLowerCase()] = val))
}

/*function lowerCaseObjectKey(obj: any): TokensValue {
  let key,
    keys = Object.keys(obj)
  let n = keys.length
  const newObj: TokensValue = {}
  while (n--) {
    key = keys[n]
    newObj[key.toLowerCase()] = obj[key]
  }
  return newObj
}*/

async function adjustTokenValue(token: IAggregateBalance | SwapVolumeProps) {
  const info = [...AVALANCHE_TOKENS_LIST, ...tokenListMarginSwap.tokens].filter(
    value => value.address.toLowerCase() === token.token.toLowerCase()
  )[0]

  return {
    ...token,
    info: {
      ...info
    }
  }
}

async function adjustTokenValueForTraders(token: ISwap) {
  const info = [...AVALANCHE_TOKENS_LIST, ...tokenListMarginSwap.tokens].filter(
    value => value.address.toLowerCase() === token.fromToken.toLowerCase()
  )[0]

  return {
    ...token,
    info: {
      ...info
    }
  }
}

//polygon-pos - avalanche - binance-smart-chain
export async function getBscTokenUSDPrice(tokenAddress: string[]): Promise<TokensValue | void> {
  if (tokenAddress.length > 0) {
    const bscPrices = await axiosInstance.get(`/simple/token_price/binance-smart-chain`, {
      params: {
        contract_addresses: tokenAddress.join(','),
        vs_currencies: 'usd'
      }
    })

    const transformKeys = await Promise.all(
      Object.keys(bscPrices.data).map(pp => lowerCaseObjectKey({ [pp]: bscPrices.data[pp] }))
    )

    return Object.assign({}, ...transformKeys)
  }
}

export async function getPolygonTokenUSDPrice(tokenAddress: string[]): Promise<TokensValue | void> {
  if (tokenAddress.length > 0) {
    const polygonPrices = await axiosInstance.get(`/simple/token_price/polygon-pos`, {
      params: {
        contract_addresses: tokenAddress.join(','),
        vs_currencies: 'usd'
      }
    })

    const transformKeys = await Promise.all(
      Object.keys(polygonPrices.data).map(pp => lowerCaseObjectKey({ [pp]: polygonPrices.data[pp] }))
    )

    return Object.assign({}, ...transformKeys)
  }
}

export async function getAvalancheTokenUSDPrice(): Promise<TokensValue> {
  const legacyTokens: any[] = []
  tokenListMarginSwap.tokens.forEach((info: any) => {
    if (info.chainId === 43114) legacyTokens.push({ ...info, address: info.address.toLowerCase() })
  })

  const allAvalancheTokens = [...AVALANCHE_TOKENS_LIST, ...legacyTokens]
  const tokenTypes = allAvalancheTokens.map(token => token?.coingeckoId)

  const prices = await axiosInstance.get(`/simple/price`, {
    params: {
      ids: tokenTypes.join(','),
      vs_currencies: 'usd'
    }
  })

  const avalancheTokens: TokensValue = {}

  await allAvalancheTokens.forEach(avax => {
    const newObj = { [avax.address.toLowerCase()]: prices.data[avax.coingeckoId] }
    Object.assign(avalancheTokens, newObj)
  })

  const transformKeys = await Promise.all(
    Object.keys(avalancheTokens).map(pp => lowerCaseObjectKey({ [pp]: avalancheTokens[pp] }))
  )

  return Object.assign({}, ...transformKeys)
}

export async function getEthTokenUSDPrice(tokenAddress: string[]) {
  if (tokenAddress.length > 0) {
    const ethPrices = await axiosInstance.get(`/simple/token_price/ethereum`, {
      params: {
        contract_addresses: tokenAddress.join(','),
        vs_currencies: 'usd'
      }
    })

    const transformKeys = await Promise.all(
      Object.keys(ethPrices.data).map(pp => lowerCaseObjectKey({ [pp]: ethPrices.data[pp] }))
    )

    return Object.assign({}, ...transformKeys)
  }
}

export async function getTopTraders({
  polygonData,
  avalancheData,
  bscData,
  ethData
}: VolumeSwaps): Promise<TopTradersProps[]> {
  const polygonTokenAddresses = await Promise.all(polygonData.map(swap => swap.fromToken))
  const bscTokenAddresses = await Promise.all(bscData.map((swap: { fromToken: any }) => swap.fromToken))
  const ethTokenAddresses = await Promise.all(ethData.map((swap: { fromToken: any }) => swap.fromToken))

  const polygonTokensPrice = await getPolygonTokenUSDPrice(polygonTokenAddresses)
  const avalancheTokensPrice = await getAvalancheTokenUSDPrice()
  const bscTokensPrice = await getBscTokenUSDPrice(bscTokenAddresses)
  const ethTokensPrice = await getEthTokenUSDPrice(ethTokenAddresses)

  let swaps = []
  swaps = await Promise.all(
    [...polygonData, ...avalancheData, ...bscData, ...ethData].map(t => adjustTokenValueForTraders(t))
  )

  const tokensPrice = { ...polygonTokensPrice, ...avalancheTokensPrice, ...bscTokensPrice, ...ethTokensPrice }

  const swapWithTokensUsdValue = swaps.map(swap => {
    const mult = tokensPrice[swap.fromToken]?.usd || 0
    return {
      ...swap,
      usdTokenValue:
        Number(
          new TokenAmount(
            new Token(swap.info.chainId, swap.fromToken, swap.info.decimals),
            swap.fromAmount
          ).toSignificant(3)
        ) * mult
    }
  })

  const tradersInfo = await groupby(swapWithTokensUsdValue, (swap: { trader: any }) => swap.trader)

  return await Object.keys(tradersInfo)
    .map(trader => {
      const volumeValue = tradersInfo[trader]
        .map(traderInfo => traderInfo.usdTokenValue)
        .reduce((acc, cur) => acc + cur)

      return {
        trader: trader,
        volume: Number(volumeValue.toFixed(6))
      }
    })
    .sort((a, b) => b.volume - a.volume)
}

export async function getVolume({
  dailyPolygonSwapVolumes,
  dailyAvalancheSwapVolumes,
  dailyBscSwapVolumes,
  dailyEthSwapVolumes
}: GetDailyVolumeProps) {
  // avalancheTokenAddresses ->  WE ARE GETTING THIS FROM A STATIC FILE
  const polygonTokenAddresses = dailyPolygonSwapVolumes.map(dsv => dsv.token)
  const bscTokenAddresses = dailyBscSwapVolumes.map(dsv => dsv.token)
  const ethTokenAddresses = dailyEthSwapVolumes.map(dsv => dsv.token)

  const tokensAvalanchePrice = await getAvalancheTokenUSDPrice()
  const tokensPolygonPrice = await getPolygonTokenUSDPrice(polygonTokenAddresses)
  const tokensBscPrice = await getBscTokenUSDPrice(bscTokenAddresses)
  const tokensEthPrice = await getEthTokenUSDPrice(ethTokenAddresses)

  const tokensPrice = { ...tokensAvalanchePrice, ...tokensPolygonPrice, ...tokensBscPrice, ...tokensEthPrice }

  let dailyVolume = 0
  const legacyAvalanche = await Promise.all(legacyAvalancheData.dailySwapVolumes.filter(la => la.type === 'MARGIN'))
  const swapVolumes = await Promise.all(
    [
      ...dailyPolygonSwapVolumes,
      ...dailyAvalancheSwapVolumes,
      ...legacyAvalanche,
      ...dailyBscSwapVolumes,
      ...dailyEthSwapVolumes
    ].map(t => adjustTokenValue(t))
  )

  const dailySwap = swapVolumes.map((token: any) => {
    let formattedVolume = 0
    try {
      formattedVolume =
        Number(
          new TokenAmount(new Token(token.info.chainId, token.token, token.info.decimals), token.volume).toSignificant(
            3
          )
        ) * tokensPrice[token.token.toLowerCase()].usd
    } catch (err) {
      formattedVolume = 0
      console.log('Not found :::', token)
    }

    dailyVolume += formattedVolume
    return {
      time: DateTime.fromSeconds(Number(token.createdAt)).toISO().toString(),
      value: Number(formattedVolume)
    }
  })

  //Consolidating dates
  const swapResult = new Map()
  dailySwap.forEach(swap => {
    if (swapResult.get(swap.time)) swapResult.set(swap.time, swapResult.get(swap.time) + swap.value)
    else swapResult.set(swap.time, swap.value)
  })

  return {
    totalDailyVolume: Number(dailyVolume.toFixed(2)),
    dailySwap: Array.from(swapResult, ([key, value]) => ({ time: key, value: value.toFixed(6) })).sort(
      (a, b) => DateTime.fromISO(a.time).toMillis() - DateTime.fromISO(b.time).toMillis()
    )
  }
}

export async function getAggregateBalances({
  aggregateBalancesPolygon,
  aggregateBalancesAvalanche,
  aggregateBalancesBsc,
  aggregateBalancesEth
}: GetAggregateBalancesProps) {
  // avalancheTokenAddresses ->  WE ARE GETTING THIS FROM A STATIC FILE
  const polygonTokenAddresses = aggregateBalancesPolygon.map(dsv => dsv.token)
  const bscTokenAddresses = aggregateBalancesBsc.map(dsv => dsv.token)
  const ethTokenAddresses = aggregateBalancesEth.map(dsv => dsv.token)

  const tokensAvalanchePrice = await getAvalancheTokenUSDPrice()
  const tokensPolygonPrice = await getPolygonTokenUSDPrice(polygonTokenAddresses)
  const tokensBscPrice = await getBscTokenUSDPrice(bscTokenAddresses)
  const tokensEthPrice = await getEthTokenUSDPrice(ethTokenAddresses)

  const tokensPrice = { ...tokensAvalanchePrice, ...tokensPolygonPrice, ...tokensBscPrice, ...tokensEthPrice }

  let tvl = 0
  let totalBorrowed = 0
  let totalLending = 0
  const aggregateBalances: any[] = await Promise.all(
    [
      ...aggregateBalancesPolygon,
      ...aggregateBalancesAvalanche,
      ...legacyAvalancheData.aggregatedBalances,
      ...aggregateBalancesBsc,
      ...aggregateBalancesEth
    ].map(t => adjustTokenValue(t))
  )

  aggregateBalances.forEach((aggBal: any) => {
    try {
      const formattedBalance =
        Number(
          new TokenAmount(
            new Token(aggBal.info.chainId, aggBal.token, aggBal.info.decimals),
            aggBal.balance
          ).toSignificant(3)
        ) * tokensPrice[aggBal.token.toLowerCase()].usd

      tvl += formattedBalance

      if (aggBal.balanceType === 'BOND_DEPOSIT') {
        totalLending += formattedBalance
      }

      if (aggBal.balanceType === 'CROSS_MARGIN_DEBT') {
        totalBorrowed += formattedBalance
      }
    } catch (err) {
      console.log('Token not found ::', aggBal.token)
    }
  })

  return { tvl, totalBorrowed, totalLending }
}
