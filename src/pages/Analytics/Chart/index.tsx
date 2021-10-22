import React, { useCallback, useEffect, useState, useMemo } from 'react'
import { Container, ButtonsContainer, Button } from './styled'
import Plot from 'react-plotly.js'
import { AggregateBalances, ChartData, GetAggregateBalances, VolumeSwaps } from '../types'
import { getAggregateBalances, getVolume } from '../utils'

type ChartDataType = 'fees' | 'tld'

interface Props {
  aggregateBalancesData: AggregateBalances
  swapVolumesData: VolumeSwaps
}

const Chart: React.FC<Props> = ({ aggregateBalancesData, swapVolumesData }) => {
  const [chartDataTypeActived, setChartDataTypeActived] = useState<ChartDataType | null>('fees')
  const [chartData, setChartData] = useState<any>([])
  const [volumeSwap, setVolumeSwap] = useState<ChartData[]>([])
  const [fees, setFees] = useState<ChartData[]>([])
  const [locked, setLocked] = useState<ChartData[]>([])

  const getValueByKey = useCallback(
    (key: 'time' | 'value', state: string) => {
      let stateValue: ChartData[] = []

      if (state === 'volumeSwap') {
        stateValue = volumeSwap
      }

      if (state === 'fees') {
        stateValue = fees
      }

      if (state === 'locked') {
        stateValue = locked
      }

      return stateValue.map((row: ChartData) => {
        return row[key]
      })
    },
    [fees, locked, volumeSwap]
  )

  const getVolumeSwap = useCallback(async (avalancheDsv: any, polygonDsv: any, bscDsv: any, ethDsv: any) => {
    const dailySwapFormatted = await getVolume({
      dailyAvalancheSwapVolumes: avalancheDsv || [],
      dailyPolygonSwapVolumes: polygonDsv || [],
      dailyBscSwapVolumes: bscDsv || [],
      dailyEthSwapVolumes: ethDsv || []
    })

    setFees(
      dailySwapFormatted.dailySwap.map(item => ({
        time: item.time,
        value: item.value * (10 / 100)
      }))
    )
    setVolumeSwap(dailySwapFormatted.dailySwap)
  }, [])

  useEffect(() => {
    if (swapVolumesData.avalancheData.length > 0 && swapVolumesData.polygonData.length > 0) {
      getVolumeSwap(
        swapVolumesData.avalancheData,
        swapVolumesData.polygonData,
        swapVolumesData.bscData,
        swapVolumesData.ethData
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    swapVolumesData.avalancheData.length,
    swapVolumesData.polygonData.length,
    swapVolumesData.bscData.length,
    swapVolumesData.ethData.length,
    swapVolumesData.avalancheData,
    swapVolumesData.polygonData,
    swapVolumesData.bscData,
    swapVolumesData.ethData
  ])

  const getTvl = useCallback(
    async ({
      aggregateBalancesBsc,
      aggregateBalancesAvalanche,
      aggregateBalancesPolygon,
      aggregateBalancesEth
    }: GetAggregateBalances) => {
      const agregateBalancesResults = await getAggregateBalances({
        aggregateBalancesBsc,
        aggregateBalancesAvalanche,
        aggregateBalancesPolygon,
        aggregateBalancesEth
      })

      setLocked(agregateBalancesResults.tvlChart)
    },
    []
  )

  useEffect(() => {
    if (aggregateBalancesData.polygonData.length > 0 && aggregateBalancesData.avalancheData.length > 0) {
      getTvl({
        aggregateBalancesBsc: aggregateBalancesData.bscData,
        aggregateBalancesPolygon: aggregateBalancesData.polygonData,
        aggregateBalancesAvalanche: aggregateBalancesData.avalancheData,
        aggregateBalancesEth: aggregateBalancesData.ethData
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    aggregateBalancesData.avalancheData,
    aggregateBalancesData.bscData,
    aggregateBalancesData.ethData,
    aggregateBalancesData.polygonData
  ])

  const setChartDataByType = useCallback(
    (type: ChartDataType) => {
      if (type === 'fees') {
        setChartData([
          {
            type: 'bar',
            name: 'Volume',
            x: getValueByKey('time', 'volumeSwap'),
            y: getValueByKey('value', 'volumeSwap'),
            line: { color: '#17BECF' }
          },
          {
            type: 'bar',
            name: 'Fees',
            x: getValueByKey('time', 'fees'),
            y: getValueByKey('value', 'fees'),
            line: { color: 'yellow' }
          }
        ])
      }

      if (type === 'tld') {
        setChartData([
          {
            type: 'scatter',
            mode: 'lines+markers',
            name: 'Value Locked',
            x: getValueByKey('time', 'locked'),
            y: getValueByKey('value', 'locked'),
            line: { color: 'red', shape: 'hv' }
          }
        ])
      }

      setChartDataTypeActived(type)
    },
    [chartDataTypeActived, getValueByKey]
  )

  useEffect(() => {
    setChartDataByType('fees')
  }, [volumeSwap, fees])

  const renderPlot = useMemo(
    () => (
      <Plot
        data={chartData}
        className="chart"
        style={{ width: '100%', height: '100%', padding: 0 }}
        layout={{
          autosize: true,
          paper_bgcolor: '#fff',
          plot_bgcolor: 'transparent',
          barmode: 'relative',
          xaxis: {
            range:
              chartDataTypeActived === 'fees'
                ? [...getValueByKey('time', 'volumeSwap')]
                : [...getValueByKey('time', 'locked')],
            type: 'date',
            color: '#000'
          },
          yaxis: {
            autorange: true,
            autotick: true,
            type: 'linear',
            color: '#000'
          }
        }}
      />
    ),
    [chartData]
  )

  return (
    <Container>
      <ButtonsContainer>
        <Button
          onClick={() => setChartDataByType('fees')}
          className={`${chartDataTypeActived === 'fees' ? 'active' : ''}`}
        >
          Volumes & Fees
        </Button>
        <Button
          onClick={() => setChartDataByType('tld')}
          className={`${chartDataTypeActived === 'tld' ? 'active' : ''}`}
        >
          Total Locked
        </Button>
      </ButtonsContainer>
      {renderPlot}
    </Container>
  )
}

export default Chart
