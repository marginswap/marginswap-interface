import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core'
import { Stats } from './Stats'
import { DateTime } from 'luxon'
import { getAggregateBalances, getVolume, GetAggregateBalancesProps, IAggregateBalance, ISwap } from './utils'

const useStyles = makeStyles(() => ({
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

interface ISwapVolumens {
  avalancheData: ISwap[]
  polygonData: ISwap[]
  bscData: ISwap[]
  ethData: ISwap[]
}

interface IAggregateBalances {
  avalancheData: IAggregateBalance[]
  polygonData: IAggregateBalance[]
  bscData: IAggregateBalance[]
  ethData: IAggregateBalance[]
}

type NumbersProps = {
  aggregateBalancesData: IAggregateBalances
  swapVolumesData: ISwapVolumens
}

const Numbers = ({ aggregateBalancesData, swapVolumesData }: NumbersProps) => {
  const classes = useStyles()

  const [volumeSwap, setVolumeSwap] = useState<StatsProps>()
  const [dailySwap, setDailySwap] = useState<StatsProps>()
  const [lastMonthSwapVolume, setLastMonthSwapVolume] = useState<StatsProps>()
  const [montlyFees, setMontlyFees] = useState<number>()
  const [aggregateBalances, setAggregateBalances] = useState<number>()
  const [totalLending, setTotalLending] = useState<number>()
  const [totalBorrowed, setTotalBorrowed] = useState<number>()

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

    getVolumeData(
      swapVolumesData.avalancheData,
      swapVolumesData.polygonData,
      swapVolumesData.bscData,
      swapVolumesData.ethData
    )
  }, [swapVolumesData])

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

    getTvl({
      aggregateBalancesBsc: aggregateBalancesData.bscData,
      aggregateBalancesPolygon: aggregateBalancesData.polygonData,
      aggregateBalancesAvalanche: aggregateBalancesData.avalancheData,
      aggregateBalancesEth: aggregateBalancesData.ethData
    })
  }, [aggregateBalancesData])

  return (
    <>
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
    </>
  )
}

export default Numbers
