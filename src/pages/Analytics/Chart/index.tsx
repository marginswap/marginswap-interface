import React, { useCallback, useEffect, useState, useMemo } from 'react'
import { Container } from './styled'
import { ChartData, GetAggregateBalances, MarginswapData } from '../types'
import { getAggregateBalances, getMarginswapDailyTotalVolume } from '../utils'
import createPlotlyComponent from 'react-plotly.js/factory'
import moment from 'moment'

type ChartDataType = 'fees' | 'tld'

// eslint-disable-next-line
const Plotly = require('plotly.js-basic-dist-min')
const Plot = createPlotlyComponent(Plotly)
interface Props {
  marginswapData: MarginswapData
}

const Chart: React.FC<Props> = ({ marginswapData }) => {
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
        if (key === 'time') {
          return moment(row.time).utc().toDate()
        }

        return row[key]
      })
    },
    [fees, locked, volumeSwap]
  )

  const getVolumeSwap = useCallback(async () => {
    const dailySwapFormatted = await getMarginswapDailyTotalVolume(marginswapData)

    setFees(
      dailySwapFormatted.dailySwap.map(item => ({
        time: item.time,
        value: item.value * (10 / 100)
      }))
    )
    setVolumeSwap(dailySwapFormatted.dailySwap)
  }, [marginswapData])

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
    getTvl({
      aggregateBalancesBsc: marginswapData.bscMarginswapData?.aggregatedBalances || [],
      aggregateBalancesPolygon: marginswapData.maticMarginswapData?.aggregatedBalances || [],
      aggregateBalancesAvalanche: marginswapData.avaxMarginswapData?.aggregatedBalances || [],
      aggregateBalancesEth: marginswapData.ethMarginswapData?.aggregatedBalances || []
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [marginswapData])

  useEffect(() => {
    getVolumeSwap()
  }, [marginswapData])

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
            range: [...getValueByKey('time', 'volumeSwap')],
            type: 'date',
            color: '#000'
          },
          yaxis: {
            autorange: true,
            type: 'linear',
            color: '#000'
          }
        }}
      />
    ),
    [chartData]
  )

  return <Container>{renderPlot}</Container>
}

export default Chart
