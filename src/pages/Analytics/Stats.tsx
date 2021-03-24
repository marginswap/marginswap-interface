import React, { FC } from 'react'
import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles(() => ({
  stats: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '69px',
    width: '1040px',
    margin: '40px 0',
    '& p': {
      height: '90px',
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
      <p>MFI Price: ${numberFormat.format(ethPrice)}</p>
      <p>Transactions (24H): {numberFormat.format(transactions)}</p>
      <p>Fees (24H): ${numberFormat.format(fees)}</p>
      <p>Total volume: {numberFormat.format(totalVolume)}</p>
      <p>Total Bond Lending: {numberFormat.format(totalVolume)}</p>
      <p>Total Borrowed: {numberFormat.format(totalVolume)}</p>
    </div>
  )
}
