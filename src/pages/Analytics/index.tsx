import React, { useMemo } from 'react'
import Chart from './Chart'
import Numbers from './Numbers'
import TopTraders from './TopTraders'
import { Container } from './styled'
import {
  useSwapVolumesQuery,
  useAggregatedBalancesQuery,
  useMarginswapDayDataQuery
} from '../../graphql/queries/analytics'
import { apolloClient } from '../../config/apollo-config'
import { ChainId } from '@marginswap/sdk'
import { MarginswapData, MarginswapDayData } from './types'
import { WarningBar } from '../../components/Placeholders'
import moment from 'moment'

const initialDate = moment('09-09-2019').utc().unix() //use this date to consider all the historical data - Sep 9, 2019
const lteValue = moment().utc().unix()

const startOfMonth = moment().startOf('month').startOf('day').utc().unix()
const endOfMonth = moment().endOf('month').endOf('day').utc().unix()
const currentDayId = Math.floor(lteValue / 86400)

const Analytics: React.FC = () => {
  const { data: ethDsvData, loading: ethDsvLoading } = useSwapVolumesQuery({
    variables: {
      gte: initialDate,
      lte: lteValue
    },
    client: apolloClient(ChainId.MAINNET)
  })

  const { data: polygonMarginswapData, loading: maticDataLoading } = useMarginswapDayDataQuery({
    variables: {
      startOfMonth: startOfMonth,
      endOfMonth: endOfMonth,
      currentDay: currentDayId
    },
    client: apolloClient(ChainId.MATIC)
  })

  const { data: avalancheMarginswapData, loading: avaxDataLoading } = useMarginswapDayDataQuery({
    variables: {
      startOfMonth: startOfMonth,
      endOfMonth: endOfMonth,
      currentDay: currentDayId
    },
    client: apolloClient(ChainId.AVALANCHE)
  })

  const { data: bscMarginswapData, loading: bscDataLoading } = useMarginswapDayDataQuery({
    variables: {
      startOfMonth: startOfMonth,
      endOfMonth: endOfMonth,
      currentDay: currentDayId
    },
    client: apolloClient(ChainId.BSC)
  })

  const { data: ethereumMarginswapData, loading: ethereumDataLoading } = useMarginswapDayDataQuery({
    variables: {
      startOfMonth: startOfMonth,
      endOfMonth: endOfMonth,
      currentDay: currentDayId
    },
    client: apolloClient(ChainId.MAINNET)
  })

  const loadingMarginswapData = useMemo(
    () => avaxDataLoading || maticDataLoading || bscDataLoading || ethereumDataLoading,
    [avaxDataLoading, bscDataLoading, maticDataLoading, ethereumDataLoading]
  )

  const marginSwapData: MarginswapData = useMemo(() => {
    if (loadingMarginswapData) {
      return {
        avaxMarginswapData: {} as MarginswapDayData,
        maticMarginswapData: {} as MarginswapDayData,
        bscMarginswapData: {} as MarginswapDayData,
        ethMarginswapData: {} as MarginswapDayData
      }
    }

    return {
      avaxMarginswapData: avalancheMarginswapData,
      maticMarginswapData: polygonMarginswapData,
      bscMarginswapData: bscMarginswapData,
      ethMarginswapData: ethereumMarginswapData
    }
  }, [loadingMarginswapData]) // eslint-disable-line react-hooks/exhaustive-deps

  const loadingSwapVolumes = useMemo(() => ethDsvLoading, [ethDsvLoading])

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
      avalancheData: [],
      polygonData: [],
      bscData: [],
      ethData: ethDsvData?.dailySwapVolumes || []
    }
  }, [loadingSwapVolumes]) // eslint-disable-line react-hooks/exhaustive-deps

  const { data: bscAggreateBalancesData, loading: bscAggreateBalancesLoading } = useAggregatedBalancesQuery({
    variables: {
      gte: initialDate,
      lte: lteValue
    },
    client: apolloClient(ChainId.BSC)
  })

  const { data: polygonAggreateBalancesData, loading: polygonAggreateBalancesLoading } = useAggregatedBalancesQuery({
    variables: {
      gte: initialDate,
      lte: lteValue
    },
    client: apolloClient(ChainId.MATIC)
  })

  const { data: avalancheAggreateBalancesData, loading: avalancheAggreateBalancesLoading } = useAggregatedBalancesQuery(
    {
      variables: {
        gte: initialDate,
        lte: lteValue
      },
      client: apolloClient(ChainId.AVALANCHE)
    }
  )

  const { data: ethAggreateBalancesData, loading: ethAggreateBalancesLoading } = useAggregatedBalancesQuery({
    variables: {
      gte: initialDate,
      lte: lteValue
    },
    client: apolloClient(ChainId.MAINNET)
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

      <>
        <WarningBar>
          Apologies: Analytics are currently out of order while we fix scaling issues with large subgraph queries.
        </WarningBar>

        <Chart aggregateBalancesData={aggregateBalances} swapVolumesData={swapVolumes} />

        <div style={{ marginTop: '10px' }}>
          {!loadingAggregateBalances && !loadingSwapVolumes && !loadingMarginswapData ? (
            <div>Finished loading all data</div>
          ) : (
            <div>Still loading</div>
          )}
          <Numbers
            aggregateBalancesData={aggregateBalances}
            swapVolumesData={swapVolumes}
            marginswapData={marginSwapData}
          />
          <TopTraders />
        </div>
      </>
    </Container>
  )
}

export default Analytics
