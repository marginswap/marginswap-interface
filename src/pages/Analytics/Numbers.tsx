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

      setVolumeSwap(dailySwapFormatted)
    }

    if (swapVolumesData.avalancheData.length > 0 && swapVolumesData.polygonData.length > 0) {
      getVolumeData(
        swapVolumesData.avalancheData,
        swapVolumesData.polygonData,
        swapVolumesData.bscData,
        swapVolumesData.ethData
      )
    }
  }, [
    swapVolumesData.avalancheData.length,
    swapVolumesData.polygonData.length,
    swapVolumesData.bscData.length,
    swapVolumesData.ethData.length
  ])

  useEffect(() => {
    async function getDailyVolume(VolumeSwap: ChartData[]) {
      const yesterday = DateTime.fromISO(DateTime.now().toString(), { zone: 'utc' }).minus({ hour: 24 }).toMillis()
      const lastMonth = DateTime.fromISO(DateTime.now().toString(), { zone: 'utc' }).minus({ month: 1 }).toMillis()

      const lastMonthSwaps = await VolumeSwap.filter(ds => DateTime.fromISO(ds.time.toString()).toMillis() > lastMonth)
      const lastMonthVol = await lastMonthSwaps.map(s => Number(s.value)).reduce((acc, cur) => acc + cur, 0)

      const last24HSwaps = await VolumeSwap.filter(ds => DateTime.fromISO(ds.time.toString()).toMillis() > yesterday)
      const last24hVol = await last24HSwaps.map(s => Number(s.value)).reduce((acc, cur) => acc + cur, 0)

      const montlyFees = lastMonthVol * (0.1 / 100)

      setMontlyFees(Number(montlyFees.toFixed(2)))

      setDailySwap({ totalDailyVolume: last24hVol, dailySwap: last24HSwaps })
      setLastMonthSwapVolume({ totalDailyVolume: lastMonthVol, dailySwap: lastMonthSwaps })
    }

    if (volumeSwap?.dailySwap) {
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

    if (aggregateBalancesData.polygonData.length > 0 && aggregateBalancesData.avalancheData.length > 0) {
      getTvl({
        aggregateBalancesBsc: aggregateBalancesData.bscData,
        aggregateBalancesPolygon: aggregateBalancesData.polygonData,
        aggregateBalancesAvalanche: aggregateBalancesData.avalancheData,
        aggregateBalancesEth: aggregateBalancesData.ethData
      })
    }
  }, [
    aggregateBalancesData.bscData.length,
    aggregateBalancesData.polygonData.length,
    aggregateBalancesData.avalancheData.length,
    aggregateBalancesData.ethData.length
  ])

  return (
    <div className={classes.stats}>
      <div>
        <Stats
          title={'Total Volume'}
          time={'All-time Marginswap volume'}
          value={volumeSwap?.totalDailyVolume || 0}
          series={[]}
        />
      </div>
      <div>
        <Stats
          title={'Monthly Volume'}
          time={'Last 30 days Marginswap volume'}
          value={lastMonthSwapVolume?.totalDailyVolume || 0}
          series={[]}
        />
        <Stats
          title={'Daily Volume'}
          time={'Last 24 hours Marginswap volume'}
          value={Number(dailySwap?.totalDailyVolume.toFixed(2)) || 0}
          series={[]}
        />
      </div>
      <div>
        <Stats
          title={'Monthly Fees'}
          time={'Fees paid to Marginswap in the last 30 days'}
          value={montlyFees || 0}
          series={[]}
        />
        <Stats
          title={'Total Value Locked'}
          time={'Total deposits on Marginswap'}
          value={Number(aggregateBalances) || 0}
          series={[]}
        />
      </div>
      <div>
        <Stats
          title={'Total Borrowed'}
          time={'Total margin borrowing on Marginswap'}
          value={totalBorrowed || 0}
          chartColor={'#F90B0B'}
          series={[]}
        />
        <Stats
          title={'Total Lending'}
          time={'Total lending liquidity on Marginswap'}
          value={totalLending || 0}
          chartColor={'#F99808'}
          series={[]}
        />
      </div>
    </div>
  )
}

export default Numbers
