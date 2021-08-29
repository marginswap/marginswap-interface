import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core'
//import Graphic from 'components/Graphic'
import { Stats } from './Stats'
import { Wallets } from './Wallets'
import { getAggregateBalances, getDailyVolume, GetAggregateBalancesProps } from './utils'
import { DateTime } from 'luxon'
import { useSwapVolumesQuery, useAggregatedBalancesQuery } from '../../graphql/queries/analytics'
import { avalancheClient } from '../../config/apollo-config'
import { polygonClient } from '../../config/apollo-config'
//import { bscClient } from '../../config/apollo-config'

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
  const [montlySwap, setMonlySwap] = useState<StatsProps>()
  const [dailySwap, setDailySwap] = useState<StatsProps>()
  const [montlyFees, setMontlyFees] = useState<number>()
  const [aggregateBalances, setAggregateBalances] = useState<number>()
  const [totalLending, setTotalLending] = useState<number>()
  const [totalBorrowed, setTotalBorrowed] = useState<number>()

  const gteValue = Math.round(
    DateTime.fromISO(DateTime.now().toString(), { zone: 'utc' })
      .set({ hour: 0 })
      .set({ minute: 1 })
      .minus({ month: 1 })
      .minus({ day: 1 })
      .toSeconds()
  )
  const lteValue = Math.round(DateTime.fromISO(DateTime.now().toString(), { zone: 'utc' }).toSeconds())

  //dsv -> Dialy Swap Volume
  // Avalanche
  const {
    data: avalancheDsvData,
    loading: avalancheDsvLoading,
    error: avalancheDsvError
  } = useSwapVolumesQuery({
    variables: {
      gte: gteValue,
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
      gte: gteValue,
      lte: lteValue
    },
    client: polygonClient
  })

  //dsv -> Dialy Swap Volume
  // Binance Smart Contract
  /*const {
    data: bscDsvData,
    loading: bscDsvLoading,
    error: bscDsvError
  } = useSwapVolumesQuery({
    variables: {
      gte: gteValue,
      lte: lteValue
    },
    client: bscClient
  })*/

  const swapVolumesLoading = avalancheDsvLoading && polygonDsvLoading //&& bscDsvLoading
  const swapVolumesError = avalancheDsvError && polygonDsvError //&& bscDsvError

  // Binance Smart Contract
  /*const {
    data: bscAggreateBalancesData,
    loading: bscAggBalLoading,
    error: bscAggBalError
  } = useAggregatedBalancesQuery({
    client: bscClient
  })*/

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

  const aggregateBalancesLoading = polygonAggBalLoading && avalancheAggBalLoading //&& bscAggBalLoading
  const aggregateBalancesError = polygonAggBalError && avalancheAggBalError //&& bscAggBalError

  const avalancheDsv = avalancheDsvData?.dailySwapVolumes || []
  const polygonDsv = polygonDsvData?.dailySwapVolumes || []
  //const bscDsv = bscDsvData?.dailySwapVolumes || []

  useEffect(() => {
    if (avalancheDsv.length && polygonDsv.length /*&& bscDsv.length*/) {
      const getMontlyVolumeData = async (avalancheDsv: any, polygonDsv: any /* bscDsv: any*/) => {
        const dailySwapFormatted = await getDailyVolume({
          dailyAvalancheSwapVolumes: avalancheDsv || [],
          dailyPolygonSwapVolumes: polygonDsv || []
          /*dailyBscSwapVolumes: bscDsv || []*/
        })

        const montlyFees = dailySwapFormatted?.totalDailyVolume * (0.1 / 100)

        setMontlyFees(Number(montlyFees.toFixed(2)))

        setMonlySwap(dailySwapFormatted)
      }
      if (!swapVolumesLoading && !swapVolumesError) {
        getMontlyVolumeData(avalancheDsv, polygonDsv /*, bscDsv*/)
      }
    }
  }, [avalancheDsv, polygonDsv /*bscDsv*/])

  useEffect(() => {
    async function getDailyVolume(montlySwap: ChartData[]) {
      const yesterday = DateTime.fromISO(DateTime.now().toString(), { zone: 'utc' })
        .set({ hour: 0 })
        .set({ minute: 1 })
        .minus({ day: 2 })
        .toMillis()

      const last24HSwaps = await montlySwap.filter(ds => DateTime.fromISO(ds.time.toString()).toMillis() > yesterday)
      const last24hVol = await last24HSwaps.map(s => Number(s.value)).reduce((acc, cur) => acc + cur, 0)

      setDailySwap({ totalDailyVolume: last24hVol, dailySwap: last24HSwaps })
    }

    if (montlySwap?.dailySwap.length) {
      getDailyVolume(montlySwap?.dailySwap || [])
    }
  }, [montlySwap?.dailySwap])

  useEffect(() => {
    async function getTvl({
      /*aggregateBalancesBsc,*/
      aggregateBalancesAvalanche,
      aggregateBalancesPolygon
    }: GetAggregateBalancesProps) {
      const agregateBalancesResults = await getAggregateBalances({
        /*aggregateBalancesBsc,*/
        aggregateBalancesAvalanche,
        aggregateBalancesPolygon
      })
      setAggregateBalances(agregateBalancesResults.tvl)
      setTotalLending(agregateBalancesResults.totalBorrowed)
      setTotalBorrowed(agregateBalancesResults.totalLending)
    }

    if (!aggregateBalancesLoading && !aggregateBalancesError) {
      getTvl({
        /*aggregateBalancesBsc: bscAggreateBalancesData?.aggregatedBalances || [],*/
        aggregateBalancesPolygon: polygonAggreateBalancesData?.aggregatedBalances || [],
        aggregateBalancesAvalanche: avalancheAggreateBalancesData?.aggregatedBalances || []
      })
    }
  }, [
    aggregateBalancesLoading,
    aggregateBalancesError,
    /*bscAggreateBalancesData,*/
    polygonAggreateBalancesData,
    avalancheAggreateBalancesData
  ])

  /*useEffect(() => {
    if (aggregateBalances) {

    }
  }, [aggregateBalances])*/

  return (
    <div className={classes.wrapper}>
      <h2>Marginswap Analytics</h2>
      {/*<Graphic
        title={'Marginswap Volume'}
        time={'Last Month'}
        value={montlySwap?.totalDailyVolume || 0}
        series={montlySwap?.dailySwap || []}
      />*/}
      <div className={classes.stats}>
        <div>
          <Stats
            title={'Marginswap Volume'}
            time={'Last Month'}
            value={montlySwap?.totalDailyVolume || 0}
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
      <Wallets />
    </div>
  )
}
