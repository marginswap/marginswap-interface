//@ts-nocheck
import React, { useEffect, useRef } from 'react'
import { makeStyles, Paper, Theme } from '@material-ui/core'
import clsx from 'clsx'
import { useDarkModeManager } from 'state/user/hooks'
import { createChart } from 'lightweight-charts'

const useStyles = makeStyles((theme: Theme) => ({
  graphic: {
    width: '49%',
    height: '90%',
    margin: '12px',
    borderRadius: '10px'
  },
  darkMode: {
    backgroundColor: '#2E2F3C'
  }
}))

export const Graphic = ({ state }: { state: any }) => {
  const classes = useStyles()
  const [darkMode] = useDarkModeManager()
  const ref = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    if (ref.current) {
      const chart = createChart(ref.current, {
        width: 400,
        height: 300,
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
      lineSeries.setData([
        { time: '2019-04-11', value: 80.01 },
        { time: '2019-04-12', value: 96.63 },
        { time: '2019-04-13', value: 76.64 },
        { time: '2019-04-14', value: 81.89 },
        { time: '2019-04-15', value: 74.43 },
        { time: '2019-04-16', value: 80.01 },
        { time: '2019-04-17', value: 96.63 },
        { time: '2019-04-18', value: 76.64 },
        { time: '2019-04-19', value: 81.89 },
        { time: '2019-04-20', value: 74.43 }
      ])
    }
  }, [])

  return (
    <Paper
      style={{
        background: 'radial-gradient(50% 50% at 50% 50%,rgba(255,0,122,0.4) 0%,rgba(255,255,255,0) 100%)'
      }}
      className={clsx(classes.graphic, {
        [classes.darkMode]: darkMode
      })}
    >
      <div id="chart" ref={ref}></div>
    </Paper>
  )
}
