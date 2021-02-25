import React from 'react'
import { lighten, makeStyles, Paper, Theme } from '@material-ui/core'
import clsx from 'clsx'
import { useDarkModeManager } from 'state/user/hooks'

const useStyles = makeStyles((theme: Theme) => ({
  graphic: {
    width: '49%',
    height: '90%',
    margin: '12px',
    borderRadius: '10px',
    backgroundColor: lighten('#343D76', 0.75)
  },
  darkMode: {
    backgroundColor: '#2E2F3C'
  }
}))

export const Graphic = () => {
  const classes = useStyles()
  const [darkMode] = useDarkModeManager()

  return (
    <Paper
      className={clsx(classes.graphic, {
        [classes.darkMode]: darkMode
      })}
    ></Paper>
  )
}
