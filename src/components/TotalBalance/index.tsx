import { Divider, makeStyles } from '@material-ui/core'
import React, { FC } from 'react'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    borderRadius: 20,
    backgroundColor: '#2c2c5b',
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
    color: 'white',
  },
  header: {
    width: '100%',
    listStyle: 'none',
    paddingLeft: 0,
    justifyContent: 'space-between',
    display: 'flex',
    "& li": {
      display: 'inline-block'
    }
  },
  itemRoot: {

  }
}));

interface BalanceProps {
  balance?: number,
  debt?: number,
  equity?: number
}

const BalanceItem: FC<BalanceProps> = ({ balance = 0, debt = 0, equity = 0 }) => (
  <div style={{display: 'flex', justifyContent: 'space-between', margin: '1em 0'}}>
    <span>{balance.toFixed(7)}</span>
    <span>{debt.toFixed(7)}</span>
    <span>{equity.toFixed(7)}</span>
  </div>
)

export const TotalBalance = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <ul className={classes.header}>
        <li>Total Account Balance</li>
        <li>Debt</li>
        <li>Account Equity</li>
      </ul>
      <Divider style={{backgroundColor: 'white'}}/>
      <BalanceItem />
    </div>
  )
}
