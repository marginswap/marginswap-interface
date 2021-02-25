import React, { FC } from 'react'
import { makeStyles, Theme } from '@material-ui/core'

const useStyles = makeStyles((theme: Theme) => ({
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

interface StatsProps {
  ethPrice: number
  transactions: number
  fees: number
  totalVolume: number
}

export const Stats: FC<StatsProps> = ({ ethPrice, transactions, fees, totalVolume }: StatsProps) => {
  const classes = useStyles()

  const numberFormat = new Intl.NumberFormat()

  return (
    <div className={classes.stats}>
      <p>ETH Price: ${numberFormat.format(ethPrice)}</p>
      <p>Transactions (24H): {numberFormat.format(transactions)}</p>
      <p>Fees (24H): ${numberFormat.format(fees)}</p>
      <p>Total volume: {numberFormat.format(totalVolume)}</p>
    </div>
  )
}
