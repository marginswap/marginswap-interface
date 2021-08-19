import axiosInstance from '../../config/axios-config'
import { DateTime } from 'luxon'
import groupby from 'lodash.groupby'
import { utils } from 'ethers'

type DataProps = {
  fromAmount: string
  fromToken: string
  id: string
  trader: string
}

type GetTopTradersProps = {
  swaps: DataProps[]
}

//polygon-pos - avalanche - binance-smart-chain
export async function getBscTokenUSDPrice(tokenAddress: string[]) {
  return await axiosInstance.get(`/simple/token_price/binance-smart-chain`, {
    params: {
      contract_addresses: tokenAddress.join(','),
      vs_currencies: 'usd'
    }
  })
}

export async function getPolygonTokenUSDPrice(tokenAddress: string[]) {
  return await axiosInstance.get(`/simple/token_price/polygon-pos`, {
    params: {
      contract_addresses: tokenAddress.join(','),
      vs_currencies: 'usd'
    }
  })
}

export async function getAvalancheTokenUSDPrice(tokenAddress: string[]) {
  return await axiosInstance.get(`/simple/token_price/avalanche`, {
    params: {
      contract_addresses: tokenAddress.join(','),
      vs_currencies: 'usd'
    }
  })
}

type TopTradersProps = {
  trader: string
  volume: number
}

export async function getTopTraders({ swaps }: GetTopTradersProps): Promise<TopTradersProps[]> {
  const tokenAddresses = swaps.map(swap => swap.fromToken)
  const tokensPrice = await getBscTokenUSDPrice(tokenAddresses)

  const swapWithTokensUsdValue = await swaps.map(swap => ({
    ...swap,
    usdTokenValue: Number(utils.formatUnits(swap.fromAmount)) * tokensPrice.data[swap.fromToken].usd
  }))

  const tradersInfo = await groupby(swapWithTokensUsdValue, (swap: { trader: any }) => swap.trader)

  return await Object.keys(tradersInfo)
    .map(trader => ({
      trader: trader,
      volume: tradersInfo[trader].map(traderInfo => traderInfo.usdTokenValue).reduce((acc, cur) => acc + cur)
    }))
    .sort((a, b) => b.volume - a.volume)
}

type SwapVolumeProps = {
  id: string
  createdAt: string
  token: string
  volume: string
}

type GetDailyVolumeProps = {
  dailySwapVolumes: SwapVolumeProps[]
}

export async function getDailyVolume({ dailySwapVolumes }: GetDailyVolumeProps) {
  const eithTeenCeroDecimals = 100000000000000000
  const tokenAddresses = dailySwapVolumes.map(dsv => dsv.token)
  const tokensPrice = await getBscTokenUSDPrice(tokenAddresses)

  let dailyVolume = 0
  const dailySwap = dailySwapVolumes.map((token: SwapVolumeProps) => {
    const formattedVolume = (Number(token.volume) / eithTeenCeroDecimals) * tokensPrice.data[token.token].usd
    dailyVolume += formattedVolume
    return {
      time: DateTime.fromSeconds(Number(token.createdAt)).toISODate(),
      value: Number(formattedVolume.toFixed(2))
    }
  })

  //Consolidating dates
  const swapResult = new Map()
  dailySwap.forEach(swap => {
    if (swapResult.get(swap.time)) swapResult.set(swap.time, swapResult.get(swap.time) + swap.value)
    else swapResult.set(swap.time, swap.value)
  })

  return {
    totalDailyVolume: dailyVolume.toFixed(2),
    dailySwap: Array.from(swapResult, ([key, value]) => ({ time: key, value }))
  }
}
