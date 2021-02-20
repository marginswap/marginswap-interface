import { createStyles, lighten, makeStyles, Theme, Toolbar, Typography } from '@material-ui/core'
import clsx from 'clsx'
import React, { FC } from 'react'
import { useDarkModeManager } from 'state/user/hooks'

const useToolbarStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(1)
    },
    highlight:
      theme.palette.type === 'light'
        ? {
            color: theme.palette.secondary.main,
            backgroundColor: lighten('#343D76', 0.85)
          }
        : {
            color: theme.palette.text.primary,
            backgroundColor: '#343D76'
          },
    title: {
      flex: '1 1 100%'
    },
    darkMode: {
      backgroundColor: lighten('#343D76', 0.75)
    }
  })
)
interface Props {
  title: string
}

export const EnhancedTableToolbar: FC<Props> = ({ title }: Props) => {
  const classes = useToolbarStyles()
  const [darkMode] = useDarkModeManager()

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.darkMode]: darkMode
      })}
    >
      <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
        {title}
      </Typography>
    </Toolbar>
  )
}
