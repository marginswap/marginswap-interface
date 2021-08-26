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
  },
  stats: {
    display: 'flex',
    flexDirection: 'column',
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

type GraphicProps = {
  title: string
  time?: string
  value: number
  series: { time: string; value: number }[]
}

export default function Graphic({ title, time, value, series }: GraphicProps) {
  const classes = useStyles()
  const ref = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    if (ref.current && series.length) {
      const chart = createChart(ref.current, {
        width: 1024,
        height: 338,
        layout: {
          backgroundColor: 'transparent',
          textColor: 'white'
        },
        rightPriceScale: {
          scaleMargins: {
            top: 0.1,
            bottom: 0.5
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
            labelVisible: true
          }
        }
      })
      const lineSeries = chart.addAreaSeries({
        topColor: '#ff007a',
        bottomColor: 'rgba(255, 0, 122, 0)',
        lineColor: '#ff007a',
        lineWidth: 3
      })
      lineSeries.setData(series.filter(s => s.value > 10000))
    }
  }, [series.length])

  return (
    <div className={classes.stats}>
      <span>
        <div>
          <h4>{title}</h4>
          {time && <p>{time}</p>}
        </div>
        <h3>{`$${new Intl.NumberFormat().format(value)}`}</h3>
      </span>
      <Paper className={classes.graphic}>
        <div id="chart" ref={ref} />
      </Paper>
    </div>
  )
}
