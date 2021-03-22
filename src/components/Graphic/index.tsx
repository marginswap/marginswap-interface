import React, { FunctionComponent, useEffect, useRef } from 'react'
import { makeStyles, Paper } from '@material-ui/core'
import clsx from 'clsx'
import { useDarkModeManager } from 'state/user/hooks'
import { createChart } from 'lightweight-charts'

const useStyles = makeStyles(() => ({
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

export const Graphic: FunctionComponent<{ state: unknown }> = () => {
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
        { time: '2019-04-06', value: 73.22 },
        { time: '2019-04-07', value: 70.81 },
        { time: '2019-04-08', value: 69.01 },
        { time: '2019-04-09', value: 68.21 },
        { time: '2019-04-10', value: 72.09 },
        { time: '2019-04-11', value: 77.02 },
        { time: '2019-04-12', value: 83.63 },
        { time: '2019-04-13', value: 79.64 },
        { time: '2019-04-14', value: 81.89 },
        { time: '2019-04-15', value: 77.43 },
        { time: '2019-04-16', value: 80.01 },
        { time: '2019-04-17', value: 78.63 },
        { time: '2019-04-18', value: 76.64 },
        { time: '2019-04-19', value: 81.89 },
        { time: '2019-04-20', value: 74.43 },
        { time: '2019-04-21', value: 70.63 },
        { time: '2019-04-22', value: 72.13 },
        { time: '2019-04-23', value: 68.33 },
        { time: '2019-04-24', value: 73.43 },
        { time: '2019-04-25', value: 69.43 },
        { time: '2019-04-26', value: 66.21 },
        { time: '2019-04-27', value: 63.22 },
        { time: '2019-04-28', value: 60.73 },
        { time: '2019-04-29', value: 62.61 },
        { time: '2019-04-30', value: 60.83 },
        { time: '2019-05-01', value: 63.21 },
        { time: '2019-05-02', value: 65.21 },
        { time: '2019-05-03', value: 69.44 },
        { time: '2019-05-04', value: 74.34 },
        { time: '2019-05-05', value: 82.87 },
        { time: '2019-05-06', value: 95.92 },
        { time: '2019-05-07', value: 101.81 },
        { time: '2019-05-08', value: 103.12 },
        { time: '2019-05-09', value: 107.84 },
        { time: '2019-05-10', value: 105.11 },
        { time: '2019-05-11', value: 98.92 },
        { time: '2019-05-12', value: 97.02 },
        { time: '2019-05-13', value: 98.34 },
        { time: '2019-05-14', value: 95.12 },
        { time: '2019-05-15', value: 104.73 },
        { time: '2019-05-16', value: 99.68 },
        { time: '2019-05-17', value: 100.33 },
        { time: '2019-05-19', value: 103.85 },
        { time: '2019-05-20', value: 104.45 },
        { time: '2019-05-21', value: 101.54 },
        { time: '2019-05-22', value: 98.62 },
        { time: '2019-05-23', value: 99.35 },
        { time: '2019-05-24', value: 95.93 },
        { time: '2019-05-25', value: 93.76 },
        { time: '2019-05-26', value: 92.12 },
        { time: '2019-05-27', value: 93.84 },
        { time: '2019-05-28', value: 91.75 },
        { time: '2019-05-29', value: 88.79 },
        { time: '2019-05-30', value: 87.36 },
        { time: '2019-05-31', value: 85.13 },
        { time: '2019-06-01', value: 86.85 },
        { time: '2019-06-02', value: 83.46 },
        { time: '2019-06-03', value: 84.86 },
        { time: '2019-06-04', value: 86.56 },
        { time: '2019-06-05', value: 87.36 },
        { time: '2019-06-06', value: 87.02 },
        { time: '2019-06-07', value: 88.25 },
        { time: '2019-06-08', value: 89.11 },
        { time: '2019-06-09', value: 90.34 },
        { time: '2019-06-11', value: 92.32 },
        { time: '2019-06-12', value: 89.46 },
        { time: '2019-06-13', value: 88.35 },
        { time: '2019-06-14', value: 85.16 },
        { time: '2019-06-15', value: 83.12 },
        { time: '2019-06-16', value: 82.97 },
        { time: '2019-06-17', value: 80.34 },
        { time: '2019-06-18', value: 79.03 },
        { time: '2019-06-19', value: 77.01 },
        { time: '2019-06-20', value: 78.32 },
        { time: '2019-06-21', value: 76.76 },
        { time: '2019-06-22', value: 74.37 },
        { time: '2019-06-23', value: 72.13 },
        { time: '2019-06-24', value: 70.46 }
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
      <div id="chart" ref={ref} />
    </Paper>
  )
}
