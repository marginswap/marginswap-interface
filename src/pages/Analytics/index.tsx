import React, { useMemo } from 'react'
import Chart from './Chart'
import Numbers from './Numbers'
import TopTraders from './TopTraders'
import { Container } from './styled'
import { useSwapVolumesQuery, useAggregatedBalancesQuery } from '../../graphql/queries/analytics'
import { avalancheClient } from '../../config/apollo-config'
import { polygonClient } from '../../config/apollo-config'
import { bscClient } from '../../config/apollo-config'
import { ethereumClient } from '../../config/apollo-config'
import { WarningBar } from '../../components/Placeholders'
import moment from 'moment'

const initialDate = moment('09-09-2019').utc().unix() //use this date to consider all the historical data - Sep 9, 2019
const lteValue = moment().utc().unix()

const Analytics: React.FC = () => {
  const {
    data: avalancheDsvData,
    loading: avalancheLoading,
    error: avalancheError
  } = useSwapVolumesQuery({
    variables: {
      gte: initialDate,
      lte: lteValue
    },
    client: avalancheClient
  })

  const {
    data: polygonDsvData,
    loading: polygonDsvDataLoading,
    error: polygonDsvDataError
  } = useSwapVolumesQuery({
    variables: {
      gte: initialDate,
      lte: lteValue
    },
    client: polygonClient
  })

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

  const loadingSwapVolumes = useMemo(
    () => avalancheLoading || polygonDsvDataLoading || bscDsvLoading || ethDsvLoading,
    [avalancheLoading, bscDsvLoading, ethDsvLoading, polygonDsvDataLoading]
  )

  const errorsSwapVolumes = useMemo(
    () => avalancheError || polygonDsvDataError || bscDsvError || ethDsvError,
    [avalancheError, bscDsvError, ethDsvError, polygonDsvDataError]
  )
  const swapVolumes = useMemo(() => {
    if (loadingSwapVolumes) {
      return {
        avalancheData: [],
        polygonData: [],
        bscData: [],
        ethData: []
      }
    }

    return {
      avalancheData: avalancheDsvData?.dailySwapVolumes || [],
      polygonData: polygonDsvData?.dailySwapVolumes || [],
      bscData: bscDsvData?.dailySwapVolumes || [],
      ethData: ethDsvData?.dailySwapVolumes || []
    }
  }, [loadingSwapVolumes]) // eslint-disable-line react-hooks/exhaustive-deps

  const {
    data: bscAggreateBalancesData,
    loading: bscAggreateBalancesLoading,
    error: bscAggBalError
  } = useAggregatedBalancesQuery({
    variables: {
      gte: initialDate,
      lte: lteValue
    },
    client: bscClient
  })

  const {
    data: polygonAggreateBalancesData,
    loading: polygonAggreateBalancesLoading,
    error: polygonAggBalError
  } = useAggregatedBalancesQuery({
    variables: {
      gte: initialDate,
      lte: lteValue
    },
    client: polygonClient
  })

  const {
    data: avalancheAggreateBalancesData,
    loading: avalancheAggreateBalancesLoading,
    error: avalancheAggBalError
  } = useAggregatedBalancesQuery({
    variables: {
      gte: initialDate,
      lte: lteValue
    },
    client: avalancheClient
  })

  const {
    data: ethAggreateBalancesData,
    loading: ethAggreateBalancesLoading,
    error: ethAggBalError
  } = useAggregatedBalancesQuery({
    variables: {
      gte: initialDate,
      lte: lteValue
    },
    client: ethereumClient
  })

  const loadingAggregateBalances = useMemo(
    () =>
      bscAggreateBalancesLoading ||
      polygonAggreateBalancesLoading ||
      avalancheAggreateBalancesLoading ||
      ethAggreateBalancesLoading,
    [
      avalancheAggreateBalancesLoading,
      bscAggreateBalancesLoading,
      ethAggreateBalancesLoading,
      polygonAggreateBalancesLoading
    ]
  )
  const errorsAggregateBalances = useMemo(
    () => bscAggBalError || polygonAggBalError || avalancheAggBalError || ethAggBalError,
    [bscAggBalError, polygonAggBalError, avalancheAggBalError, ethAggBalError]
  )
  const aggregateBalances = useMemo(() => {
    if (loadingAggregateBalances) {
      return {
        bscData: [],
        polygonData: [],
        avalancheData: [],
        ethData: []
      }
    }

    return {
      bscData: bscAggreateBalancesData?.aggregatedBalances || [],
      polygonData: polygonAggreateBalancesData?.aggregatedBalances || [],
      avalancheData: avalancheAggreateBalancesData?.aggregatedBalances || [],
      ethData: ethAggreateBalancesData?.aggregatedBalances || []
    }
  }, [loadingAggregateBalances]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Container>
      <h2>Marginswap Analytics</h2>
      {errorsAggregateBalances && errorsSwapVolumes ? (
        <div>Error. Contact Support</div>
      ) : loadingAggregateBalances && loadingSwapVolumes ? (
        <div>Loading</div>
      ) : (
        <>
          <WarningBar>
            Apologies: Analytics are currently out of order while we fix scaling issues with large subgraph queries.
          </WarningBar>

          <Chart aggregateBalancesData={aggregateBalances} swapVolumesData={swapVolumes} />

          <div style={{ marginTop: '10px' }}>
            <Numbers aggregateBalancesData={aggregateBalances} swapVolumesData={swapVolumes} />
            <TopTraders />
          </div>
        </>
      )}
    </Container>
  )
}

export default Analytics
