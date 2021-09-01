import axiosInstance from '../../config/axios-config'
import { DateTime } from 'luxon'
import groupby from 'lodash.groupby'
import tokenList from '../../constants/tokenLists/marginswap-default.tokenlist.json'
import { AVALANCHE_TOKENS_LIST } from '../../constants'
import { TokenAmount, Token } from '@marginswap/sdk'

import legacyAvalancheData from '../../data/legacy-data/avalanche-aug-2021.json'
interface TokensValue {
  [key: string]: { usd: number }
}

interface AggregateBalances {
  balance: string
  balanceType: string
  id: string
  token: string
  createdAt: string
}

type DataProps = {
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

type VolumeSwaps = {
  polygonSwaps: DataProps[]
  avalancheSwaps: DataProps[]
  bscSwaps: DataProps[]
  ethSwaps: DataProps[]
}

export type SwapVolumeProps = {
  id: string
  createdAt: string
  token: string
  volume: string
}

export type GetAggregateBalancesProps = {
  aggregateBalancesPolygon: AggregateBalances[]
  aggregateBalancesAvalanche: AggregateBalances[]
  aggregateBalancesBsc: AggregateBalances[]
  aggregateBalancesEth: AggregateBalances[]
}

export type GetDailyVolumeProps = {
  dailyPolygonSwapVolumes: SwapVolumeProps[]
  dailyAvalancheSwapVolumes: SwapVolumeProps[]
  dailyBscSwapVolumes: SwapVolumeProps[]
  dailyEthSwapVolumes: SwapVolumeProps[]
}

async function adjustTokenValue(token: AggregateBalances | SwapVolumeProps) {
  const info = tokenList.tokens.filter(value => value.address.toLowerCase() === token.token.toLowerCase())[0]
  return {
    ...token,
    info: {
      ...info
    }
  }
}

async function adjustTokenValueForTraders(token: DataProps) {
  const info = tokenList.tokens.filter(value => value.address.toLowerCase() === token.fromToken.toLowerCase())[0]
  return {
    ...token,
    info: {
      ...info
    }
  }
}

//polygon-pos - avalanche - binance-smart-chain
export async function getBscTokenUSDPrice(tokenAddress: string[]) {
  const bscPrices = await axiosInstance.get(`/simple/token_price/binance-smart-chain`, {
    params: {
      contract_addresses: tokenAddress.join(','),
      vs_currencies: 'usd'
    }
  })

  return bscPrices.data
}

export async function getPolygonTokenUSDPrice(tokenAddress: string[]) {
  const polygonPrices = await axiosInstance.get(`/simple/token_price/polygon-pos`, {
    params: {
      contract_addresses: tokenAddress.join(','),
      vs_currencies: 'usd'
    }
  })

  return polygonPrices.data
}

export async function getAvalancheTokenUSDPrice(): Promise<TokensValue> {
  const legacyTokens: { token: any; type: any }[] = []
  tokenList.tokens.forEach((info: any) => {
    if (info.chainId === 43114) legacyTokens.push({ token: info.address, type: info.coingeckoId })
  })

  const allAvalancheTokens = [...AVALANCHE_TOKENS_LIST, ...legacyTokens]
  const tokenTypes = allAvalancheTokens.map(token => token?.type)

  const prices = await axiosInstance.get(`/simple/price`, {
    params: {
      ids: tokenTypes.join(','),
      vs_currencies: 'usd'
    }
  })

  const avalancheTokens: TokensValue = {}

  await allAvalancheTokens.forEach(avax => {
    const newObj = { [avax.token.toLowerCase()]: prices.data[avax.type] }
    Object.assign(avalancheTokens, newObj)
  })

  return avalancheTokens
}

export async function getEthTokenUSDPrice(tokenAddress: string[]) {
  const ethPrices = await axiosInstance.get(`/simple/token_price/ethereum`, {
    params: {
      contract_addresses: tokenAddress.join(','),
      vs_currencies: 'usd'
    }
  })

  return ethPrices.data
}

export async function getTopTraders({
  polygonSwaps,
  avalancheSwaps,
  bscSwaps,
  ethSwaps
}: VolumeSwaps): Promise<TopTradersProps[]> {
  const polygonTokenAddresses = await Promise.all(polygonSwaps.map(swap => swap.fromToken))
  const bscTokenAddresses = await Promise.all(bscSwaps.map((swap: { fromToken: any }) => swap.fromToken))
  const ethTokenAddresses = await Promise.all(ethSwaps.map((swap: { fromToken: any }) => swap.fromToken))

  const polygonTokensPrice = await getPolygonTokenUSDPrice(polygonTokenAddresses)
  const avalancheTokensPrice = await getAvalancheTokenUSDPrice()
  const bscTokensPrice = await getBscTokenUSDPrice(bscTokenAddresses)
  const ethTokensPrice = await getEthTokenUSDPrice(ethTokenAddresses)

  /*const avalancheSwapsLegacy = await Promise.all(
    legacyAvalancheData.swaps.map(s => ({
      trader: s.trader,
      id: s.id,
      fromToken: s.fromToken,
      fromAmount: s.fromAmount
    }))
  )*/
  const tempo = [...polygonSwaps, ...avalancheSwaps, /*...avalancheSwapsLegacy,*/ ...bscSwaps, ...ethSwaps]
  /*tempo.forEach(s => {
    if (
      Number(s.createdAt) >
      DateTime.fromISO(DateTime.now().toString(), { zone: 'utc' })
        .set({ hour: 0 })
        .set({ minute: 1 })
        .minus({ day: 1 })
        .toSeconds()
    ) {
      console.log('Older :::', DateTime.fromSeconds(Number(s.createdAt)).toISODate())
    }
  })*/

  let swaps = []
  swaps = await Promise.all(
    [...polygonSwaps, ...avalancheSwaps, /*...avalancheSwapsLegacy,*/ ...bscSwaps, ...ethSwaps].map(t =>
      adjustTokenValueForTraders(t)
    )
  )

  const tokensPrice = { ...polygonTokensPrice, ...avalancheTokensPrice, ...bscTokensPrice, ...ethTokensPrice }

  const swapWithTokensUsdValue = swaps.map(swap => ({
    ...swap,
    usdTokenValue:
      Number(
        new TokenAmount(
          new Token(swap.info.chainId, swap.fromToken, swap.info.decimals),
          swap.fromAmount
        ).toSignificant(3)
      ) * tokensPrice[swap.fromToken].usd
  }))

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

export async function getDailyVolume({
  dailyPolygonSwapVolumes,
  dailyAvalancheSwapVolumes,
  dailyBscSwapVolumes,
  dailyEthSwapVolumes
}: GetDailyVolumeProps) {
  // avalancheTokenAddresses ->  WE ARE GETTING THIS FROM A STATIC FILE
  const polygonTokenAddresses = dailyPolygonSwapVolumes.map(dsv => dsv.token)
  const bscTokenAddresses = dailyBscSwapVolumes.map(dsv => dsv.token)
  const ethTokenAddresses = dailyEthSwapVolumes.map(dsv => dsv.token)

  /*const avalancheSwapVolumeLegacy = await Promise.all(
    legacyAvalancheData.dailySwapVolumes.map(s => ({
      createdAt: s.createdAt,
      id: s.id,
      token: s.token,
      volume: s.volume
    }))
  )*/

  const tokensAvalanchePrice = await getAvalancheTokenUSDPrice()
  const tokensPolygonPrice = await getPolygonTokenUSDPrice(polygonTokenAddresses)
  const tokensBscPrice = await getBscTokenUSDPrice(bscTokenAddresses)
  const tokensEthPrice = await getEthTokenUSDPrice(ethTokenAddresses)

  const tokensPrice = { ...tokensAvalanchePrice, ...tokensPolygonPrice, ...tokensBscPrice, ...tokensEthPrice }

  let dailyVolume = 0
  const swapVolumes = await Promise.all(
    [
      ...dailyPolygonSwapVolumes,
      ...dailyAvalancheSwapVolumes,
      /*...avalancheSwapVolumeLegacy,*/
      ...dailyBscSwapVolumes,
      ...dailyEthSwapVolumes
    ].map(t => adjustTokenValue(t))
  )

  const dailySwap = swapVolumes.map((token: any) => {
    let formattedVolume = 0

    formattedVolume =
      Number(
        new TokenAmount(new Token(token.info.chainId, token.token, token.info.decimals), token.volume).toSignificant(3)
      ) * tokensPrice[token.token].usd

    dailyVolume += formattedVolume
    return {
      time: DateTime.fromSeconds(Number(token.createdAt)).toFormat('yyyy-MM-dd').toString(),
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
    dailySwap: Array.from(swapResult, ([key, value]) => ({ time: key, value: value.toFixed(2) })).sort(
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

  const avalancheAggreateBalancesLegacy = await Promise.all(
    legacyAvalancheData.aggregatedBalances.map(ab => ({
      balance: ab.balance,
      balanceType: ab.balanceType,
      createdAt: ab.createdAt,
      id: ab.id,
      token: ab.token
    }))
  )

  const tokensPrice = { ...tokensAvalanchePrice, ...tokensPolygonPrice, ...tokensBscPrice, ...tokensEthPrice }

  let tvl = 0
  let totalBorrowed = 0
  let totalLending = 0
  const aggregateBalances: any[] = await Promise.all(
    [
      ...aggregateBalancesPolygon,
      ...aggregateBalancesAvalanche,
      ...avalancheAggreateBalancesLegacy,
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
        ) * tokensPrice[aggBal.token].usd

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
