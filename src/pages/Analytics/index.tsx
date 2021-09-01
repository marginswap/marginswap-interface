import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core'
import { Stats } from './Stats'
//import { Wallets } from './Wallets'
import { getAggregateBalances, getVolume, GetAggregateBalancesProps } from './utils'
import { DateTime } from 'luxon'
import { useSwapVolumesQuery, useAggregatedBalancesQuery } from '../../graphql/queries/analytics'
import { avalancheClient } from '../../config/apollo-config'
import { polygonClient } from '../../config/apollo-config'
import { bscClient } from '../../config/apollo-config'
import { ethereumClient } from '../../config/apollo-config'

const useStyles = makeStyles(() => ({
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    padding: '0 20px',
    gap: '20px',
    '& h2': {
      width: '1040px'
    }
  },
  stats: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '1024px',
    '& p': {
      margin: '10px 0',
      fontWeight: 600,
      fontSize: '15px'
    }
  }
}))

type ChartData = {
  time: string
  value: number
}

type StatsProps = {
  totalDailyVolume: number
  dailySwap: ChartData[]
}

export const Analytics = () => {
  const classes = useStyles()
  const [volumeSwap, setVolumeSwap] = useState<StatsProps>()
  const [dailySwap, setDailySwap] = useState<StatsProps>()
  const [lastMonthSwapVolume, setLastMonthSwapVolume] = useState<StatsProps>()
  const [montlyFees, setMontlyFees] = useState<number>()
  const [aggregateBalances, setAggregateBalances] = useState<number>()
  const [totalLending, setTotalLending] = useState<number>()
  const [totalBorrowed, setTotalBorrowed] = useState<number>()

  const initialDate = 1567311501 //use this date to consider all the historical data - Sep 9, 2019
  const lteValue = Math.round(DateTime.fromISO(DateTime.now().toString(), { zone: 'utc' }).toSeconds())

  //dsv -> Dialy Swap Volume
  // Avalanche
  const {
    data: avalancheDsvData,
    loading: avalancheDsvLoading,
    error: avalancheDsvError
  } = useSwapVolumesQuery({
    variables: {
      gte: initialDate,
      lte: lteValue
    },
    client: avalancheClient
  })

  //dsv -> Dialy Swap Volume
  // Polygon
  const {
    data: polygonDsvData,
    loading: polygonDsvLoading,
    error: polygonDsvError
  } = useSwapVolumesQuery({
    variables: {
      gte: initialDate,
      lte: lteValue
    },
    client: polygonClient
  })

  //dsv -> Dialy Swap Volume
  // Binance Smart Contract
  const {
    data: bscDsvData,
    loading: bscDsvLoading,
    error: bscDsvError
  } = useSwapVolumesQuery({
    variables: {
      gte: initialDate,
      lte: lteValue
    },
    client: bscClient
  })

  //dsv -> Dialy Swap Volume
  // Ethereum
  const {
    data: ethDsvData,
    loading: ethDsvLoading,
    error: ethDsvError
  } = useSwapVolumesQuery({
    variables: {
      gte: initialDate,
      lte: lteValue
    },
    client: ethereumClient
  })

  const swapVolumesLoading = avalancheDsvLoading && polygonDsvLoading && bscDsvLoading && ethDsvLoading
  const swapVolumesError = avalancheDsvError && polygonDsvError && bscDsvError && ethDsvError

  // Binance Smart Contract
  const {
    data: bscAggreateBalancesData,
    loading: bscAggBalLoading,
    error: bscAggBalError
  } = useAggregatedBalancesQuery({
    client: bscClient
  })

  // Polygon Smart Contract
  const {
    data: polygonAggreateBalancesData,
    loading: polygonAggBalLoading,
    error: polygonAggBalError
  } = useAggregatedBalancesQuery({
    client: polygonClient
  })

  // Avalanche Smart Contract
  const {
    data: avalancheAggreateBalancesData,
    loading: avalancheAggBalLoading,
    error: avalancheAggBalError
  } = useAggregatedBalancesQuery({
    client: avalancheClient
  })

  // Avalanche Smart Contract
  const {
    data: ethAggreateBalancesData,
    loading: ethAggBalLoading,
    error: ethAggBalError
  } = useAggregatedBalancesQuery({
    client: ethereumClient
  })

  const aggregateBalancesLoading =
    polygonAggBalLoading && avalancheAggBalLoading && bscAggBalLoading && ethAggBalLoading
  const aggregateBalancesError = polygonAggBalError && avalancheAggBalError && bscAggBalError && ethAggBalError

  const avalancheDsv = avalancheDsvData?.dailySwapVolumes || []
  const polygonDsv = polygonDsvData?.dailySwapVolumes || []
  const bscDsv = bscDsvData?.dailySwapVolumes || []
  const ethDsv = ethDsvData?.dailySwapVolumes || []

  useEffect(() => {
    const getVolumeData = async (avalancheDsv: any, polygonDsv: any, bscDsv: any, ethDsv: any) => {
      const dailySwapFormatted = await getVolume({
        dailyAvalancheSwapVolumes: avalancheDsv || [],
        dailyPolygonSwapVolumes: polygonDsv || [],
        dailyBscSwapVolumes: bscDsv || [],
        dailyEthSwapVolumes: ethDsv || []
      })

      const montlyFees = dailySwapFormatted?.totalDailyVolume * (0.1 / 100)

      setMontlyFees(Number(montlyFees.toFixed(2)))

      setVolumeSwap(dailySwapFormatted)
    }

    if (!swapVolumesLoading && !swapVolumesError) {
      getVolumeData(avalancheDsv, polygonDsv, bscDsv, ethDsv)
    }
  }, [swapVolumesLoading, swapVolumesError, avalancheDsv.length, polygonDsv.length, bscDsv.length, ethDsv.length])

  useEffect(() => {
    async function getDailyVolume(VolumeSwap: ChartData[]) {
      const yesterday = DateTime.fromISO(DateTime.now().toString(), { zone: 'utc' })
        .set({ hour: 0 })
        .set({ minute: 1 })
        .minus({ day: 1 })
        .toMillis()

      const lastMonth = DateTime.fromISO(DateTime.now().toString(), { zone: 'utc' })
        .set({ hour: 0 })
        .set({ minute: 1 })
        .minus({ month: 1 })
        .toMillis()

      const lastMonthSwaps = await VolumeSwap.filter(ds => DateTime.fromISO(ds.time.toString()).toMillis() > lastMonth)
      const lastMonthVol = await lastMonthSwaps.map(s => Number(s.value)).reduce((acc, cur) => acc + cur, 0)

      const last24HSwaps = await VolumeSwap.filter(ds => DateTime.fromISO(ds.time.toString()).toMillis() > yesterday)
      const last24hVol = await last24HSwaps.map(s => Number(s.value)).reduce((acc, cur) => acc + cur, 0)

      setDailySwap({ totalDailyVolume: last24hVol, dailySwap: last24HSwaps })
      setLastMonthSwapVolume({ totalDailyVolume: lastMonthVol, dailySwap: lastMonthSwaps })
    }

    if (volumeSwap?.dailySwap.length) {
      getDailyVolume(volumeSwap?.dailySwap || [])
    }
  }, [volumeSwap?.dailySwap])

  useEffect(() => {
    async function getTvl({
      aggregateBalancesBsc,
      aggregateBalancesAvalanche,
      aggregateBalancesPolygon,
      aggregateBalancesEth
    }: GetAggregateBalancesProps) {
      const agregateBalancesResults = await getAggregateBalances({
        aggregateBalancesBsc,
        aggregateBalancesAvalanche,
        aggregateBalancesPolygon,
        aggregateBalancesEth
      })
      setAggregateBalances(agregateBalancesResults.tvl)
      setTotalLending(agregateBalancesResults.totalLending)
      setTotalBorrowed(agregateBalancesResults.totalBorrowed)
    }

    if (!aggregateBalancesLoading && !aggregateBalancesError) {
      getTvl({
        aggregateBalancesBsc: bscAggreateBalancesData?.aggregatedBalances || [],
        aggregateBalancesPolygon: polygonAggreateBalancesData?.aggregatedBalances || [],
        aggregateBalancesAvalanche: avalancheAggreateBalancesData?.aggregatedBalances || [],
        aggregateBalancesEth: ethAggreateBalancesData?.aggregatedBalances || []
      })
    }
  }, [
    aggregateBalancesLoading,
    aggregateBalancesError,
    bscAggreateBalancesData,
    polygonAggreateBalancesData,
    avalancheAggreateBalancesData,
    ethAggreateBalancesData
  ])

  return (
    <div className={classes.wrapper}>
      <h2>Marginswap Analytics</h2>
      <div className={classes.stats}>
        <div>
          <Stats title={'Marginswap Volume'} time={''} value={volumeSwap?.totalDailyVolume || 0} series={[]} />
        </div>
        <div>
          <Stats
            title={'Marginswap Volume'}
            time={'Last Month'}
            value={lastMonthSwapVolume?.totalDailyVolume || 0}
            series={[]}
          />
          <Stats
            title={'Marginswap Volume'}
            time={'Last 24 hrs'}
            value={Number(dailySwap?.totalDailyVolume.toFixed(2)) || 0}
            series={[]}
          />
        </div>
        <div>
          <Stats title={'Total Fees'} time={'Fees paid past month'} value={montlyFees || 0} series={[]} />
          <Stats title={'Total Value Locked'} time={''} value={Number(aggregateBalances) || 0} series={[]} />
        </div>
        <div>
          <Stats title={'Total Borrowed'} time={''} value={totalBorrowed || 0} chartColor={'#F90B0B'} series={[]} />
          <Stats title={'Total Lending'} time={''} value={totalLending || 0} chartColor={'#F99808'} series={[]} />
        </div>
      </div>
      {/*<Wallets />*/}
    </div>
  )
}
