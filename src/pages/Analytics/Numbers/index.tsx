import React, { useEffect, useState, useCallback } from 'react'
import { Container } from './styled'
import Stats from '../Stats'
import {
  getAggregateBalances,
  getFormattedVolume,
  getTotalVolumeForNetwork,
  getMonthlyVolumeForNetwork,
  getDailyVolumeForNetwork
} from '../utils'
import { GetAggregateBalances, MarginswapData } from '../types'
import { ChainId } from '@marginswap/sdk'

interface Props {
  marginswapData: MarginswapData
}

const LEGACY_AVALANCHE_TOTAL_VOLUME = 6076197.33

const Numbers: React.FC<Props> = ({ marginswapData }: Props) => {
  const [montlyFees, setMontlyFees] = useState<number>()
  const [aggregateBalances, setAggregateBalances] = useState<number>()
  const [totalLending, setTotalLending] = useState<number>()
  const [totalBorrowed, setTotalBorrowed] = useState<number>()
  const [totalVolumeUsd, setTotalVolumeUsd] = useState<number>(0)
  const [montlyVolumeUsd, setMonthlyVolumeUsd] = useState<number>(0)
  const [dailyVolumeUsd, setDailyVolumeUsd] = useState<number>(0)

  const getTotalVolumeData = useCallback(async (marginswapData: MarginswapData) => {
    let totalVolumeUsd = 0

    const avaxTotalVolume = await getTotalVolumeForNetwork(marginswapData.avaxMarginswapData)
    const maticTotalVolume = await getTotalVolumeForNetwork(marginswapData.maticMarginswapData)
    const bscTotalVolume = await getTotalVolumeForNetwork(marginswapData.bscMarginswapData)
    const ethTotalVolume = await getTotalVolumeForNetwork(marginswapData.ethMarginswapData)

    totalVolumeUsd += await getFormattedVolume(avaxTotalVolume, ChainId.AVALANCHE)
    totalVolumeUsd += await getFormattedVolume(maticTotalVolume, ChainId.MATIC)
    totalVolumeUsd += await getFormattedVolume(bscTotalVolume, ChainId.BSC)
    totalVolumeUsd += await getFormattedVolume(ethTotalVolume, ChainId.MAINNET)

    setTotalVolumeUsd(totalVolumeUsd + LEGACY_AVALANCHE_TOTAL_VOLUME)
  }, [])

  const getMonthlyVolumeData = useCallback(async (marginswapData: MarginswapData) => {
    let totalMonthlyUsd = 0

    const avaxMonthlyVolume = await getMonthlyVolumeForNetwork(marginswapData.avaxMarginswapData, ChainId.AVALANCHE)
    const maticMonthlyVolume = await getMonthlyVolumeForNetwork(marginswapData.maticMarginswapData, ChainId.MATIC)
    const bscMonthlyVolume = await getMonthlyVolumeForNetwork(marginswapData.bscMarginswapData, ChainId.BSC)
    const ethMonthlyVolume = await getMonthlyVolumeForNetwork(marginswapData.ethMarginswapData, ChainId.MAINNET)

    totalMonthlyUsd += avaxMonthlyVolume
    totalMonthlyUsd += maticMonthlyVolume
    totalMonthlyUsd += bscMonthlyVolume
    totalMonthlyUsd += ethMonthlyVolume

    setMonthlyVolumeUsd(totalMonthlyUsd)
  }, [])

  const getDailyVolumeData = useCallback(async (marginswapData: MarginswapData) => {
    let totalDailyVolume = 0

    const avaxDailyVolume = await getDailyVolumeForNetwork(marginswapData.avaxMarginswapData)
    const maticDailyVolume = await getDailyVolumeForNetwork(marginswapData.maticMarginswapData)
    const bscDailyVolume = await getDailyVolumeForNetwork(marginswapData.bscMarginswapData)
    const ethDailyVolume = await getDailyVolumeForNetwork(marginswapData.ethMarginswapData)

    totalDailyVolume += await getFormattedVolume(avaxDailyVolume, ChainId.AVALANCHE)
    totalDailyVolume += await getFormattedVolume(maticDailyVolume, ChainId.MATIC)
    totalDailyVolume += await getFormattedVolume(bscDailyVolume, ChainId.BSC)
    totalDailyVolume += await getFormattedVolume(ethDailyVolume, ChainId.MAINNET)

    setDailyVolumeUsd(totalDailyVolume)
  }, [])

  useEffect(() => {
    getTotalVolumeData(marginswapData)
    getMonthlyVolumeData(marginswapData)
    getDailyVolumeData(marginswapData)
  }, [marginswapData])

  useEffect(() => {
    const montlyFees = montlyVolumeUsd * (0.1 / 100)

    setMontlyFees(Number(montlyFees.toFixed(2)))
  }, [montlyVolumeUsd])

  const getTvl = useCallback(
    async ({
      aggregateBalancesBsc,
      aggregateBalancesAvalanche,
      aggregateBalancesPolygon,
      aggregateBalancesEth
    }: GetAggregateBalances) => {
      const agregateBalancesResults = await getAggregateBalances({
        aggregateBalancesBsc,
        aggregateBalancesAvalanche,
        aggregateBalancesPolygon,
        aggregateBalancesEth
      })

      setAggregateBalances(agregateBalancesResults.tvl)
      setTotalLending(agregateBalancesResults.totalLending)
      setTotalBorrowed(agregateBalancesResults.totalBorrowed)
    },
    []
  )

  useEffect(() => {
    getTvl({
      aggregateBalancesBsc: marginswapData.bscMarginswapData?.aggregatedBalances || [],
      aggregateBalancesPolygon: marginswapData.maticMarginswapData?.aggregatedBalances || [],
      aggregateBalancesAvalanche: marginswapData.avaxMarginswapData?.aggregatedBalances || [],
      aggregateBalancesEth: marginswapData.ethMarginswapData?.aggregatedBalances || []
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [marginswapData])

  return (
    <Container>
      <Stats title={'Total Volume'} time={'All-time Marginswap volume'} value={totalVolumeUsd || 0} />

      <div>
        <Stats title={'Monthly Volume'} time={'Last 30 days Marginswap volume'} value={montlyVolumeUsd || 0} />
        <Stats title={'Daily Volume'} time={'Last 24 hours Marginswap volume'} value={dailyVolumeUsd || 0} />
      </div>

      <div>
        <Stats title={'Monthly Fees'} time={'Fees paid to Marginswap in the last 30 days'} value={montlyFees || 0} />
        <Stats
          title={'Total Value Locked'}
          time={'Total deposits on Marginswap'}
          value={Number(aggregateBalances) || 0}
        />
      </div>

      <div>
        <Stats title={'Total Borrowed'} time={'Total margin borrowing on Marginswap'} value={totalBorrowed || 0} />
        <Stats title={'Total Lending'} time={'Total lending liquidity on Marginswap'} value={totalLending || 0} />
      </div>
    </Container>
  )
}

export default Numbers
