import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core'
import Graphic from 'components/Graphic'
import { Stats } from './Stats'
import { Wallets } from './Wallets'
import { getDailyVolume } from './utils'
import { DateTime } from 'luxon'
import { useSwapVolumesQuery } from '../../graphql/queries/analytics'
import { avalancheClient } from '../../config/apollo-config'
import { polygonClient } from '../../config/apollo-config'
import { bscClient } from '../../config/apollo-config'

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
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '30px',
    width: '1040px',
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
  const gteValue = Math.round(
    DateTime.fromISO(DateTime.now().toString(), { zone: 'utc' })
      .set({ hour: 0 })
      .set({ minute: 1 })
      .minus({ month: 1 })
      .minus({ day: 1 })
      .toSeconds()
  )
  const lteValue = Math.round(DateTime.fromISO(DateTime.now().toString(), { zone: 'utc' }).toSeconds())

  //console.log('one day before ::', gteValue)
  //console.log('today ::', lteValue)

  //dsv -> Dialy Swap Volume
  // Avalanche
  const { data: avalancheDsvData } = useSwapVolumesQuery({
    variables: {
      gte: gteValue,
      lte: lteValue
    },
    client: avalancheClient
  })

  //dsv -> Dialy Swap Volume
  // Polygon
  const { data: polygonDsvData } = useSwapVolumesQuery({
    variables: {
      gte: gteValue,
      lte: lteValue
    },
    client: polygonClient
  })

  //dsv -> Dialy Swap Volume
  // Binance Smart Contract
  const { data: bscDsvData } = useSwapVolumesQuery({
    variables: {
      gte: gteValue,
      lte: lteValue
    },
    client: bscClient
  })

  const avalancheDsv = avalancheDsvData?.dailySwapVolumes || []
  const polygonDsv = polygonDsvData?.dailySwapVolumes || []
  const bscDsv = bscDsvData?.dailySwapVolumes || []

  useEffect(() => {
    if (avalancheDsv.length && polygonDsv.length && bscDsv.length) {
      const getMontlyVolumeData = async (avalancheDsv: any, polygonDsv: any, bscDsv: any) => {
        const dailySwapFormatted = await getDailyVolume({
          dailyAvalancheSwapVolumes: avalancheDsv,
          dailyPolygonSwapVolumes: polygonDsv,
          dailyBscSwapVolumes: bscDsv
        })

        const montlyFees = dailySwapFormatted?.totalDailyVolume * (0.1 / 100)

        setMontlyFees(Number(montlyFees.toFixed(2)))

        setMonlySwap(dailySwapFormatted)
      }
      getMontlyVolumeData(avalancheDsv, polygonDsv, bscDsv)
    }
  }, [avalancheDsv, polygonDsv, bscDsv])

  useEffect(() => {
    async function getDailyVolume(montlySwap: ChartData[]) {
      console.log('🚀 ~ file: index.tsx ~ line 117 ~ getDailyVolume ~ montlySwap', montlySwap)
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

  return (
    <div className={classes.wrapper}>
      <h2>Marginswap Analytics</h2>
      <Graphic
        title={'Marginswap Volume'}
        time={'Last Month'}
        value={montlySwap?.totalDailyVolume || 0}
        series={montlySwap?.dailySwap || []}
      />
      <div className={classes.stats}>
        <Stats
          title={'Total Fees'}
          time={'Fees paid past month'}
          value={montlyFees || 0}
          chartColor={'#BE72F3'}
          series={[]}
        />
        <Stats
          title={'Marginswap Volume'}
          time={'Last 24 hrs'}
          value={Number(dailySwap?.totalDailyVolume.toFixed(2)) || 0}
          chartColor={'#94F572'}
          series={[]}
        />
        {/*
        <Stats
          title={'Fees'}
          time={'Last 24 hrs'}
          value={mvData?.totalDailyVolume}
          chartColor={'#F90B0B'}
          series={dailySwap?.dailySwap || []}
        />
        <Stats
          title={'Total Volume'}
          time={'Last 24 hrs'}
          value={mvData?.totalDailyVolume}
          chartColor={'#F99808'}
          series={dailySwap?.dailySwap || []}
       />*/}
      </div>
      <Wallets />
    </div>
  )
}
