import React from 'react'
import { makeStyles } from '@material-ui/core'
import { DateTime } from 'luxon'
import Numbers from './Numbers'
import { Wallets } from './Wallets'
import { useSwapVolumesQuery, useAggregatedBalancesQuery, useSwapsQuery } from '../../graphql/queries/analytics'
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
  }
}))

export const Analytics = () => {
  const classes = useStyles()

  const initialDate = 1567311501 //use this date to consider all the historical data - Sep 9, 2019
  const gteValue = Math.round(
    DateTime.fromISO(DateTime.now().toString(), { zone: 'utc' })
      .set({ hour: 0 })
      .set({ minute: 1 })
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
  const swapVolumes = {
    avalancheData: avalancheDsvData?.dailySwapVolumes || [],
    polygonData: polygonDsvData?.dailySwapVolumes || [],
    bscData: bscDsvData?.dailySwapVolumes || [],
    ethData: ethDsvData?.dailySwapVolumes || []
  }

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
  const aggregateBalances = {
    bscData: bscAggreateBalancesData?.aggregatedBalances || [],
    polygonData: polygonAggreateBalancesData?.aggregatedBalances || [],
    avalancheData: avalancheAggreateBalancesData?.aggregatedBalances || [],
    ethData: ethAggreateBalancesData?.aggregatedBalances || []
  }

  const {
    loading: avaSwapsLoading,
    error: avaSwapsError,
    data: avaSwapsData
  } = useSwapsQuery({
    client: avalancheClient,
    variables: {
      gte: gteValue,
      lte: lteValue
    }
  })

  const {
    loading: polySwapsLoading,
    error: polySwapsError,
    data: polySwapsData
  } = useSwapsQuery({
    client: polygonClient,
    variables: {
      gte: gteValue,
      lte: lteValue
    }
  })

  const {
    loading: bscSwapsLoading,
    error: bscSwapsError,
    data: bscSwapsData
  } = useSwapsQuery({
    client: bscClient,
    variables: {
      gte: gteValue,
      lte: lteValue
    }
  })

  const {
    loading: ethSwapsLoading,
    error: ethSwapsError,
    data: ethSwapsData
  } = useSwapsQuery({
    client: ethereumClient,
    variables: {
      gte: gteValue,
      lte: lteValue
    }
  })

  const swapsLoading = avaSwapsLoading && polySwapsLoading && bscSwapsLoading && ethSwapsLoading
  const swapsError = avaSwapsError && polySwapsError && bscSwapsError && ethSwapsError
  const swaps = {
    bscData: avaSwapsData?.swaps || [],
    polygonData: polySwapsData?.swaps || [],
    avalancheData: bscSwapsData?.swaps || [],
    ethData: ethSwapsData?.swaps || []
  }

  const showError = swapsError && aggregateBalancesError && swapVolumesError

  return (
    <div className={classes.wrapper}>
      <h2>Marginswap Analytics</h2>
      {showError ? (
        <div>Error. Contact Support</div>
      ) : aggregateBalancesLoading && swapVolumesLoading && swapsLoading ? (
        <div>Loading</div>
      ) : (
        <>
          <Numbers aggregateBalancesData={aggregateBalances} swapVolumesData={swapVolumes} />
          <Wallets swaps={swaps} />
        </>
      )}
    </div>
  )
}
