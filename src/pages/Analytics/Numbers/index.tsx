import React, { useEffect, useState, useCallback } from 'react'
import { Container } from './styled'
import Stats from '../Stats'
import { getAggregateBalances, getVolume } from '../utils'
import { AggregateBalances, ChartData, GetAggregateBalances, StatsProps, VolumeSwaps } from '../types'
import moment from 'moment'

interface Props {
  aggregateBalancesData: AggregateBalances
  swapVolumesData: VolumeSwaps
}

const Numbers: React.FC<Props> = ({ aggregateBalancesData, swapVolumesData }: Props) => {
  const [volumeSwap, setVolumeSwap] = useState<StatsProps>()
  const [dailySwap, setDailySwap] = useState<StatsProps>()
  const [lastMonthSwapVolume, setLastMonthSwapVolume] = useState<StatsProps>()
  const [montlyFees, setMontlyFees] = useState<number>()
  const [aggregateBalances, setAggregateBalances] = useState<number>()
  const [totalLending, setTotalLending] = useState<number>()
  const [totalBorrowed, setTotalBorrowed] = useState<number>()

  const getDailyVolume = useCallback(async (VolumeSwap: ChartData[]) => {
    const lastMonthSwaps = await VolumeSwap.filter(ds => moment(ds.time).utc().isAfter(moment().subtract(1, 'months')))
    const lastMonthVol = await lastMonthSwaps.map(s => Number(s.value)).reduce((acc, cur) => acc + cur, 0)

    const last24HSwaps = await VolumeSwap.filter(ds => moment(ds.time).utc().isAfter(moment().subtract(1, 'days')))
    const last24hVol = await last24HSwaps.map(s => Number(s.value)).reduce((acc, cur) => acc + cur, 0)

    const montlyFees = lastMonthVol * (0.1 / 100)

    setMontlyFees(Number(montlyFees.toFixed(2)))

    setDailySwap({ totalDailyVolume: last24hVol, dailySwap: last24HSwaps })
    setLastMonthSwapVolume({ totalDailyVolume: lastMonthVol, dailySwap: lastMonthSwaps })
  }, [])

  const getVolumeData = useCallback(
    async (avalancheDsv: any, polygonDsv: any, bscDsv: any, ethDsv: any) => {
      const dailySwapFormatted = await getVolume({
        dailyAvalancheSwapVolumes: avalancheDsv || [],
        dailyPolygonSwapVolumes: polygonDsv || [],
        dailyBscSwapVolumes: bscDsv || [],
        dailyEthSwapVolumes: ethDsv || []
      })

      setVolumeSwap(dailySwapFormatted)
      getDailyVolume(dailySwapFormatted.dailySwap)
    },
    [getDailyVolume]
  )

  useEffect(() => {
    if (swapVolumesData.avalancheData.length > 0 && swapVolumesData.polygonData.length > 0) {
      console.log('swapVolumesData', swapVolumesData)
      getVolumeData(
        swapVolumesData.avalancheData,
        swapVolumesData.polygonData,
        swapVolumesData.bscData,
        swapVolumesData.ethData
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    swapVolumesData.avalancheData.length,
    swapVolumesData.polygonData.length,
    swapVolumesData.bscData.length,
    swapVolumesData.ethData.length,
    swapVolumesData.avalancheData,
    swapVolumesData.polygonData,
    swapVolumesData.bscData,
    swapVolumesData.ethData
  ])

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
    if (aggregateBalancesData.polygonData.length > 0 && aggregateBalancesData.avalancheData.length > 0) {
      console.log('aggregateBalancesData', aggregateBalancesData)
      getTvl({
        aggregateBalancesBsc: aggregateBalancesData.bscData,
        aggregateBalancesPolygon: aggregateBalancesData.polygonData,
        aggregateBalancesAvalanche: aggregateBalancesData.avalancheData,
        aggregateBalancesEth: aggregateBalancesData.ethData
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    aggregateBalancesData.avalancheData,
    aggregateBalancesData.bscData,
    aggregateBalancesData.ethData,
    aggregateBalancesData.polygonData
  ])

  return (
    <Container>
      <Stats title={'Total Volume'} time={'All-time Marginswap volume'} value={volumeSwap?.totalDailyVolume || 0} />

      <div>
        <Stats
          title={'Monthly Volume'}
          time={'Last 30 days Marginswap volume'}
          value={lastMonthSwapVolume?.totalDailyVolume || 0}
        />
        <Stats
          title={'Daily Volume'}
          time={'Last 24 hours Marginswap volume'}
          value={Number(dailySwap?.totalDailyVolume.toFixed(2)) || 0}
        />
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
