import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core'
import { Graphics } from './Graphics'
import { Stats } from './Stats'
import { Wallets } from './Wallets'
import { TokenInfo } from '@uniswap/token-lists'
import { useFetchListCallback } from 'hooks/useFetchListCallback'
import { useAllLists } from 'state/lists/hooks'
import { getDailyVolume } from './utils'
import { DateTime } from 'luxon'
import { useSwapVolumesQuery } from '../../graphql/queries/analytics'
import { polygonClient as apolloClient } from '../../config/apollo-config'

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

type StatsProps = {
  totalDailyVolume: string
  dailySwap: { time: string; value: number }[]
}

export const Analytics = () => {
  const classes = useStyles()
  const [dailySwap, setDailySwap] = useState<StatsProps>()
  const [montlySwap, setMontlySwap] = useState<StatsProps>()

  console.log('one day before ::', Math.round(DateTime.now().minus({ day: 1 }).toSeconds()))
  console.log('today ::', Math.round(DateTime.now().toSeconds()))
  //dsv -> Dialy Swap Volume
  const {
    loading: dsvLoading,
    error: dsvError,
    data: dsvData
  } = useSwapVolumesQuery({
    variables: {
      gte: Math.round(DateTime.now().minus({ day: 1 }).toSeconds()),
      lte: Math.round(DateTime.now().toSeconds())
    },
    client: apolloClient
  })

  //mv -> Mountly Volume
  const {
    loading: mvLoading,
    error: mvError,
    data: mvData
  } = useSwapVolumesQuery({
    variables: {
      gte: Math.round(DateTime.now().minus({ day: 1 }).toSeconds()),
      lte: Math.round(DateTime.now().toSeconds())
    },
    client: apolloClient
  })
  /*console.log('🚀 ~ file: index.tsx ~ line 44 ~ Analytics ~ data', dsvData)
  console.log('🚀 ~ file: index.tsx ~ line 44 ~ Analytics ~ error', dsvError)
  console.log('🚀 ~ file: index.tsx ~ line 44 ~ Analytics ~ loading', dsvLoading)*/

  useEffect(() => {
    if (dsvData) {
      const getDailyVolumeData = async (dsvData: {
        dailySwapVolumes: { id: string; createdAt: string; token: string; volume: string }[]
      }) => {
        const dailySwapFormatted = await getDailyVolume(dsvData)
        setDailySwap(dailySwapFormatted)
      }
      getDailyVolumeData(dsvData)
    }
  }, [dsvData])

  /*useEffect(() => {
    if (mvData) {
      const getDailyVolumeData = async (mvData: {
        dailySwapVolumes: { id: string; createdAt: string; token: string; volume: string }[]
      }) => {
        const dailySwapFormatted = await getDailyVolume(mvData)
        setDailySwap(dailySwapFormatted)
      }
      getDailyVolumeData(mvData)
    }
  }, [mvData])*/

  //const fetchList = useFetchListCallback()

  /*useEffect(() => {
    const url = Object.keys(lists)[0]
    if (url) {
      fetchList(url, false)
        .then(({ tokens }) => {
          setTokens(tokens)
        })
        .catch(error => console.error('interval list fetching error', error))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])*/

  return (
    <div className={classes.wrapper}>
      <h2>MarginSwap Analytics</h2>
      <Graphics series={dailySwap?.dailySwap || []} />
      <div className={classes.stats}>
        <Stats
          title={'MFI Price'}
          time={'Last 24 hrs'}
          value={dailySwap?.totalDailyVolume}
          chartColor={'#BE72F3'}
          series={dailySwap?.dailySwap || []}
        />
        {/*<Stats
          title={'MFI Price'}
          time={'Last Month'}
          value={mvData?.totalDailyVolume}
          chartColor={'#BE72F3'}
          series={dailySwap?.dailySwap || []}
        />
        <Stats
          title={'Total Fees'}
          time={'Ever Collected'}
          value={mvData?.totalDailyVolume}
          chartColor={'#94F572'}
          series={dailySwap?.dailySwap || []}
        />
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
