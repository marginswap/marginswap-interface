import React from 'react'
import { lighten, makeStyles, Paper, Theme } from '@material-ui/core'
import clsx from 'clsx'
import { useDarkModeManager } from 'state/user/hooks'
import { Graphic } from 'components/Graphic'

const useStyles = makeStyles((theme: Theme) => ({
  darkMode: {
    backgroundColor: lighten('#1b2041', 0.25)
  },
  graphics: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 400,
    width: '100%',
    borderRadius: '10px'
  }
}))

export const Graphics = () => {
  const classes = useStyles()
  const [darkMode] = useDarkModeManager()

  return (
    <Paper
      className={clsx(classes.graphics, {
        [classes.darkMode]: darkMode
      })}
    >
      <Graphic />
      <Graphic />
    </Paper>
  )
}
