import React from 'react'
import { makeStyles, Paper, Theme } from '@material-ui/core'
import clsx from 'clsx'
import { useDarkModeManager } from 'state/user/hooks'
import { Line } from 'react-chartjs-2'

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

  return (
    <Paper
      className={clsx(classes.graphic, {
        [classes.darkMode]: darkMode
      })}
    >
      <Line
        data={state}
        options={{
          title: {
            display: false,
            text: 'Average Rainfall per month',
            fontSize: 20
          },
          legend: {
            display: false,
            position: 'left'
          }
        }}
      />
    </Paper>
  )
}
