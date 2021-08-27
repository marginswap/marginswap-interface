import axiosInstance from '../../config/axios-config'
import { DateTime } from 'luxon'
import groupby from 'lodash.groupby'
import { BigNumber } from 'bignumber.js'
import { AVALANCHE_TOKENS_LIST } from '../../constants'

type DataProps = {
  fromAmount: string
  fromToken: string
  id: string
  trader: string
}
interface TokensValue {
  [key: string]: { usd: number }
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
  const tokenTypes = AVALANCHE_TOKENS_LIST.map(token => token.type)

  const prices = await axiosInstance.get(`/simple/price`, {
    params: {
      ids: tokenTypes.join(','),
      vs_currencies: 'usd'
    }
  })

  const avalancheTokens: TokensValue = {}

  await AVALANCHE_TOKENS_LIST.forEach(avax => {
    const newObj = { [avax.token]: prices.data[avax.type] }
    Object.assign(avalancheTokens, newObj)
  })

  return avalancheTokens
}

type TopTradersProps = {
  trader: string
  volume: number
}

type VolumeSwaps = {
  polygonSwaps: DataProps[]
  avalancheSwaps: DataProps[]
  /*bscSwaps: DataProps[]*/
}

export async function getTopTraders({
  polygonSwaps,
  avalancheSwaps
}: /*bscSwaps*/
VolumeSwaps): Promise<TopTradersProps[]> {
  const polygonTokenAddresses = await Promise.all(polygonSwaps.map(swap => swap.fromToken))
  //const bscTokenAddresses = await Promise.all(bscSwaps.map(swap => swap.fromToken))

  const polygonTokensPrice = await getPolygonTokenUSDPrice(polygonTokenAddresses)
  const avalancheTokensPrice = await getAvalancheTokenUSDPrice()
  //const bscTokensPrice = await getBscTokenUSDPrice(bscTokenAddresses)

  let swaps = []
  swaps = [...polygonSwaps, ...avalancheSwaps /*...bscSwaps*/]
  const tokensPrice = { ...polygonTokensPrice, ...avalancheTokensPrice /*...bscTokensPrice*/ }

  const swapWithTokensUsdValue = await swaps.map(swap => ({
    ...swap,
    usdTokenValue:
      Number(new BigNumber(swap.fromAmount).shiftedBy(-17).toFixed(2, BigNumber.ROUND_HALF_UP)) *
      tokensPrice[swap.fromToken].usd
  }))

  const tradersInfo = await groupby(swapWithTokensUsdValue, (swap: { trader: any }) => swap.trader)

  return await Object.keys(tradersInfo)
    .map(trader => {
      const volumeValue = tradersInfo[trader]
        .map(traderInfo => traderInfo.usdTokenValue)
        .reduce((acc, cur) => acc + cur)

      return {
        trader: trader,
        volume: Number(volumeValue.toFixed(2))
      }
    })
    .sort((a, b) => b.volume - a.volume)
}

export type SwapVolumeProps = {
  id: string
  createdAt: string
  token: string
  volume: string
}

export type GetDailyVolumeProps = {
  dailyPolygonSwapVolumes: SwapVolumeProps[]
  dailyAvalancheSwapVolumes: SwapVolumeProps[]
  //dailyBscSwapVolumes: SwapVolumeProps[]
}

export async function getDailyVolume({
  dailyPolygonSwapVolumes,
  dailyAvalancheSwapVolumes
}: /*dailyBscSwapVolumes*/
GetDailyVolumeProps) {
  // avalancheTokenAddresses ->  WE ARE GETTING THIS FROM A STATIC FILE
  const polygonTokenAddresses = dailyPolygonSwapVolumes.map(dsv => dsv.token)
  //const bscTokenAddresses = dailyBscSwapVolumes.map(dsv => dsv.token)

  const tokensAvalanchePrice = await getAvalancheTokenUSDPrice()
  const tokensPolygonPrice = await getPolygonTokenUSDPrice(polygonTokenAddresses)
  //const tokensBscPrice = await getBscTokenUSDPrice(bscTokenAddresses)

  const tokensPrice = { ...tokensAvalanchePrice, ...tokensPolygonPrice /*...tokensBscPrice*/ }

  let dailyVolume = 0
  const dailySwap = [...dailyPolygonSwapVolumes, ...dailyAvalancheSwapVolumes /*...dailyBscSwapVolumes*/].map(
    (token: SwapVolumeProps) => {
      let formattedVolume = 0

      formattedVolume =
        Number(new BigNumber(token.volume).shiftedBy(-17).toFixed(2, BigNumber.ROUND_HALF_UP)) *
        tokensPrice[token.token].usd

      dailyVolume += formattedVolume
      return {
        time: DateTime.fromSeconds(Number(token.createdAt)).toFormat('yyyy-MM-dd').toString(),
        value: Number(formattedVolume)
      }
    }
  )

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

interface AggregateBalances {
  balance: string
  balanceType: string
  id: string
  token: string
}

export type GetAggregateBalancesProps = {
  aggregateBalancesPolygon: AggregateBalances[]
  aggregateBalancesAvalanche: AggregateBalances[]
  /*aggregateBalancesBsc: AggregateBalances[]*/
}

export async function getAggregateBalances({
  aggregateBalancesPolygon,
  aggregateBalancesAvalanche
}: /*aggregateBalancesBsc*/
GetAggregateBalancesProps) {
  // avalancheTokenAddresses ->  WE ARE GETTING THIS FROM A STATIC FILE
  const polygonTokenAddresses = aggregateBalancesPolygon.map(dsv => dsv.token)
  //const bscTokenAddresses = aggregateBalancesBsc.map(dsv => dsv.token)

  const tokensAvalanchePrice = await getAvalancheTokenUSDPrice()
  const tokensPolygonPrice = await getPolygonTokenUSDPrice(polygonTokenAddresses)
  //const tokensBscPrice = await getBscTokenUSDPrice(bscTokenAddresses)

  const tokensPrice = { ...tokensAvalanchePrice, ...tokensPolygonPrice /*...tokensBscPrice*/ }

  let tvl = 0
  let totalBorrowed = 0
  let totalLending = 0
  const aggregateBalances = [...aggregateBalancesPolygon, ...aggregateBalancesAvalanche /*...aggregateBalancesBsc*/]
  aggregateBalances.forEach((aggBal: AggregateBalances) => {
    try {
      const formattedBalance =
        Number(new BigNumber(aggBal.balance).shiftedBy(-17).toFixed(2, BigNumber.ROUND_HALF_UP)) *
        tokensPrice[aggBal.token].usd

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
