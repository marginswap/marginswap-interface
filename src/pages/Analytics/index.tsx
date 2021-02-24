import React from 'react'
import { makeStyles, Paper, Theme } from '@material-ui/core'

const useStyles = makeStyles((theme: Theme) => ({
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    padding: '0 20px',
    gap: '20px'
  },
  header: {
    margin: 0
  },
  stats: {
    display: 'flex',
    flexDirection: 'row',
    gap: '20px'
  },
  graphics: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 400,
    width: '100%',
    borderRadius: '10px'
  },
  graphic: {
    width: '48%',
    height: '96%',
    backgroundColor: 'grey',
    borderRadius: '10px'
  }
}))

export const Analytics = () => {
  const classes = useStyles()

  return (
    <div className={classes.wrapper}>
      <div className={classes.header}>
        <h2>MarginSwap Analytics</h2>
        <div className={classes.stats}>
          <p>ETH Price: $1,594</p>
          <p>Transactions (24H): 110,284</p>
          <p>Fees (24H): $5,313,268</p>
          <p>Total volume: 26</p>
        </div>
      </div>
      <Paper className={classes.graphics}>
        <div className={classes.graphic}></div>
        <div className={classes.graphic}></div>
      </Paper>
    </div>
  )
}
