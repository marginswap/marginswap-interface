import AppBody from 'pages/AppBody'
import React, { useState } from 'react'
import Collapse from '@material-ui/core/Collapse'
import { ExchangePrice, exchanges } from './constants'
import { makeStyles } from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import IconButton from '@material-ui/core/IconButton'

export const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    justifyContent: 'space-between',
    borderBottom: '2px solid gray',
    color: 'grey',
    fontSize: '15px',
    maxWidth: 400,
    margin: '12px 24px 0 24px',
    padding: '10px 0'
  },
  container: {
    display: 'flex',
    flexDirection: 'column'
  },
  exchange: {
    fontSize: '14px',
    display: 'flex',
    justifyContent: 'space-between',
    maxWidth: 400,
    margin: '2px 24px',
    padding: '10px 0'
  },
  exchangeSpan: {
    width: '33.3%',
    '&:nth-child(even)': {
      textAlign: 'center'
    },
    '&:nth-child(3)': {
      textAlign: 'end'
    }
  },
  expand: {
    margin: 'auto',
    marginBottom: '6px',
    border: 'none',
    cursor: 'pointer',
    color: 'unset',
    backgroundColor: 'inherit'
  }
}))

const Exchange = ({ exchange, price, gasFees }: ExchangePrice) => {
  const classes = useStyles()
  return (
    <div key={exchange} className={classes.exchange}>
      <span className={classes.exchangeSpan}>{exchange}</span>
      <span className={classes.exchangeSpan}>{price}</span>
      <span className={classes.exchangeSpan}>{gasFees} $ </span>
    </div>
  )
}

const Exchanges = ({ exchanges }: { exchanges: ExchangePrice[] }) => {
  return <>{exchanges.map(exchange => Exchange(exchange))}</>
}

export function GasFees() {
  const classes = useStyles()
  const [checked, setChecked] = useState(false)

  const handleChange = () => {
    setChecked(prev => !prev)
  }

  return (
    <AppBody>
      <div className={classes.container}>
        <div className={classes.root}>
          <span className={classes.exchangeSpan}>EXCHANGE</span>
          <span className={classes.exchangeSpan}>PRICE</span>
          <span className={classes.exchangeSpan}>GAS FEES</span>
        </div>
        <Exchanges exchanges={exchanges.slice(0, 3)} />
        <Collapse in={checked}>
          <Exchanges exchanges={exchanges.slice(3)} />
        </Collapse>
        <IconButton className={classes.expand} onClick={handleChange}>
          {checked ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </div>
    </AppBody>
  )
}
