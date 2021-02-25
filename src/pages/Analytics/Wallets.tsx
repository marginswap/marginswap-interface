import React, { useState } from 'react'
import Collapse from '@material-ui/core/Collapse'
import { WalletInfo, wallets } from './constants'
import { makeStyles, Paper } from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import IconButton from '@material-ui/core/IconButton'
import clsx from 'clsx'
import { useDarkModeManager } from 'state/user/hooks'

export const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    justifyContent: 'space-between',
    borderBottom: '2px solid gray',
    fontSize: '15px',
    margin: '12px 24px 0 24px',
    padding: '10px 0'
  },
  main: {
    backgroundColor: '#fff'
  },
  container: {
    display: 'flex',
    flexDirection: 'column'
  },
  darkMode: {
    backgroundColor: '#2E2F3C',
    color: '#fff'
  },
  exchange: {
    fontSize: '14px',
    display: 'flex',
    justifyContent: 'space-between',
    margin: '2px 24px',
    padding: '10px 0'
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

const Wallet = ({ exchange, price, gasFees }: WalletInfo) => {
  const classes = useStyles()
  const numberFormat = new Intl.NumberFormat()

  return (
    <div key={exchange} className={classes.exchange}>
      <span>{exchange}</span>
      <span>{price}</span>
      <span>${numberFormat.format(gasFees)}</span>
    </div>
  )
}

const WalletsInfo = ({ wallets }: { wallets: WalletInfo[] }) => {
  return <>{wallets.map(wallet => Wallet(wallet))}</>
}

export function Wallets() {
  const classes = useStyles()
  const [darkMode] = useDarkModeManager()

  const [checked, setChecked] = useState(false)

  const handleChange = () => {
    setChecked(prev => !prev)
  }

  return (
    <Paper
      className={clsx(classes.main, {
        [classes.darkMode]: darkMode
      })}
    >
      <div className={classes.container}>
        <div className={classes.root}>
          <span>Wallet</span>
          <span>Volume (24hrs)</span>
        </div>
        <WalletsInfo wallets={wallets.slice(0, 3)} />
        <Collapse in={checked}>
          <WalletsInfo wallets={wallets.slice(3)} />
        </Collapse>
        <IconButton className={classes.expand} onClick={handleChange}>
          {checked ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </div>
    </Paper>
  )
}
