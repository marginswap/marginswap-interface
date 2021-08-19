import React, { useEffect, useRef } from 'react'
import { makeStyles, Paper } from '@material-ui/core'
import { createChart } from 'lightweight-charts'

const useStyles = makeStyles(() => ({
  graphic: {
    background:
      'linear-gradient(138.53deg, rgba(230, 80, 255, 0.0925) -1.05%, rgba(74, 74, 74, 0.25) 28.45%, rgba(50, 50, 50, 0) 76.54%, rgba(146, 163, 180, 0) 76.54%)',
    backdropFilter: 'blur(10px)',
    border: '1px solid #777777',
    borderRadius: '12px'
  }
}))

type GraphicProps = {
  series: { time: string; value: number }[]
}

export default function Graphic({ series }: GraphicProps) {
  console.log('🚀 ~ file: index.tsx ~ line 20 ~ Graphic ~ series', series)
  const classes = useStyles()
  const ref = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    if (ref.current && series.length) {
      const chart = createChart(ref.current, {
        width: 505,
        height: 338,
        layout: {
          backgroundColor: 'transparent',
          textColor: 'black'
        },
        rightPriceScale: {
          scaleMargins: {
            top: 0.32,
            bottom: 0
          },
          borderVisible: false
        },
        timeScale: {
          borderVisible: false
        },
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
        topColor: '#ff007a',
        bottomColor: 'rgba(255, 0, 122, 0)',
        lineColor: '#ff007a',
        lineWidth: 3
      })
      lineSeries.setData(series)
    }
  }, [series.length])

  return (
    <Paper className={classes.graphic}>
      <div id="chart" ref={ref} />
    </Paper>
  )
}
