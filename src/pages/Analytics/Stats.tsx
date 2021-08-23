import React, { FC, useEffect, useRef } from 'react'
import { makeStyles } from '@material-ui/core'
import { createChart } from 'lightweight-charts'

const useStyles = makeStyles(() => ({
  stats: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    margin: '40px 0',
    '& span': {
      height: '90px',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      '& div': {
        gap: '8px'
      },
      '& h3': {
        margin: '0',
        fontSize: '15px',
        lineHeight: '18px'
      },
      '& p': {
        margin: '0',
        fontWeight: '300',
        fontSize: '14px',
        lineHeight: '17px',
        color: '#D0D0D0'
      },
      '& h4': {
        margin: '0',
        fontWeight: 'normal',
        fontSize: '22px',
        lineHeight: '27px'
      }
    }
  }
}))

interface StatsProps {
  title: string
  time?: string
  value?: number
  chartColor?: string
  series: { time: string; value: number }[]
}

export const Stats: FC<StatsProps> = ({ title, time, value, chartColor, series }: StatsProps) => {
  const classes = useStyles()
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (ref.current && series.length) {
      const chart = createChart(ref.current, {
        width: 285,
        height: 76,
        layout: {
          backgroundColor: 'transparent',
          textColor: 'black'
        },
        rightPriceScale: {
          visible: false,
          scaleMargins: {
            top: 1,
            bottom: 0
          },
          borderVisible: false
        },
        timeScale: {
          visible: false,
          borderVisible: false
        },
        handleScroll: false,
        grid: {
          horzLines: {
            color: 'rgba(197, 203, 206, 0.5)',
            visible: false
          },
          vertLines: {
            color: 'rgba(197, 203, 206, 0.5)',
            visible: false
          }
        },
        crosshair: {
          horzLine: {
            visible: false,
            labelVisible: false
          },
          vertLine: {
            visible: true,
            style: 0,
            width: 2,
            color: 'rgba(32, 38, 46, 0.1)',
            labelVisible: false
          }
        }
      })
      const lineSeries = chart.addAreaSeries({
        lineColor: chartColor,
        lineWidth: 3
      })
      lineSeries.applyOptions({
        baseLineVisible: false
      })
      lineSeries.setData(series)
    }
  }, [series.length])

  return (
    <div className={classes.stats}>
      <span>
        <div>
          <h4>{title}</h4>
          {time && <p>{time}</p>}
        </div>
        <h3>{`$${value}`}</h3>
      </span>
      {chartColor && <div id="chart" ref={ref} />}
    </div>
  )
}
