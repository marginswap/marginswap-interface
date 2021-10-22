import React, { useMemo } from 'react'
import Chart from './Chart'
import Numbers from './Numbers'
import TopTraders from './TopTraders'
import { Container } from './styled'
import { Wallets } from './Wallets'
import { useSwapVolumesQuery, useAggregatedBalancesQuery, useSwapsQuery } from '../../graphql/queries/analytics'
import { avalancheClient } from '../../config/apollo-config'
import { polygonClient } from '../../config/apollo-config'
import { bscClient } from '../../config/apollo-config'
import { ethereumClient } from '../../config/apollo-config'
import { WarningBar } from '../../components/Placeholders'
import moment from 'moment'

const initialDate = moment('09-09-2019').utc().unix() //use this date to consider all the historical data - Sep 9, 2019
const lteValue = moment().utc().unix()

const useStyles = makeStyles(() => ({
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    maxWidth: '420px',
    padding: '0 20px',
    gap: '20px',
    '& h2': {
      width: '1040px'
    }
  }
}))

const Analytics: React.FC = () => {
  const { data: avalancheDsvData, loading: avalancheLoading } = useSwapVolumesQuery({
    variables: {
      gte: initialDate,
      lte: lteValue
    },
    client: avalancheClient
  })

  const { data: polygonDsvData, loading: polygonDsvDataLoading } = useSwapVolumesQuery({
    variables: {
      gte: initialDate,
      lte: lteValue
    },
    client: polygonClient
  })

  const { data: bscDsvData, loading: bscDsvLoading } = useSwapVolumesQuery({
    variables: {
      gte: initialDate,
      lte: lteValue
    },
    client: bscClient
  })

  const { data: ethDsvData, loading: ethDsvLoading } = useSwapVolumesQuery({
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

  const { data: bscAggreateBalancesData, loading: bscAggreateBalancesLoading } = useAggregatedBalancesQuery({
    variables: {
      gte: initialDate,
      lte: lteValue
    },
    client: bscClient
  })

  const { data: polygonAggreateBalancesData, loading: polygonAggreateBalancesLoading } = useAggregatedBalancesQuery({
    variables: {
      gte: initialDate,
      lte: lteValue
    },
    client: polygonClient
  })

  const { data: avalancheAggreateBalancesData, loading: avalancheAggreateBalancesLoading } = useAggregatedBalancesQuery(
    {
      variables: {
        gte: initialDate,
        lte: lteValue
      },
      client: avalancheClient
    }
  )

  const { data: ethAggreateBalancesData, loading: ethAggreateBalancesLoading } = useAggregatedBalancesQuery({
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

      <Chart aggregateBalancesData={aggregateBalances} swapVolumesData={swapVolumes} />

      <div style={{ marginTop: '10px' }}>
        <Numbers aggregateBalancesData={aggregateBalances} swapVolumesData={swapVolumes} />
        <TopTraders />
      </div>
    </Container>
  )
}

export default Analytics
