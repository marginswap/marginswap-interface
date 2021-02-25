import React from 'react'
import { makeStyles, Theme } from '@material-ui/core'
import { Graphics } from './Graphics'
import { Stats } from './Stats'
import { Wallets } from './Wallets'

const useStyles = makeStyles((theme: Theme) => ({
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    padding: '0 20px',
    gap: '20px',
    '& h2, h3, p': {
      marginLeft: '12px'
    }
  },
  stats: {
    display: 'flex',
    flexDirection: 'row',
    gap: '20px',
    '& p': {
      margin: '10px 0',
      fontWeight: 600,
      fontSize: '15px'
    }
  }
}))

export const Analytics = () => {
  const classes = useStyles()

  return (
    <div className={classes.wrapper}>
      <h2>MarginSwap Analytics</h2>
      <Stats ethPrice={1594} transactions={110284} fees={5313268} totalVolume={26} />
      <Graphics />
      <h3>Top Traders</h3>
      <Wallets />
    </div>
  )
}
