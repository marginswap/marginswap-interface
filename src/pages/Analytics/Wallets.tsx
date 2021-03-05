import React, { useEffect, useState } from 'react'
import Collapse from '@material-ui/core/Collapse'
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
    fontSize: '17px',
    margin: '12px 24px 0 24px',
    padding: '10px 0'
  },
  main: {
    backgroundColor: '#fff',
    borderRadius: '10px'
  },
  container: {
    display: 'flex',
    flexDirection: 'column'
  },
  darkMode: {
    backgroundColor: '#2E2F3C',
    color: '#fff'
  },
  walletsList: {
    '& li': {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '3px solid transparent',
      padding: '12px 24px',
      '& span': {
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }
    },
    '& li:hover': {
      borderBottom: '3px solid #80808033'
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

interface WalletData {
  address: number
  volume: number
}

function createWalletData(address: number, volume: number): WalletData {
  return {
    address,
    volume
  }
}

const Wallet = ({ wallet }: { wallet: WalletData; index: number }) => {
  const numberFormat = new Intl.NumberFormat()
  const { address, volume } = wallet

  return (
    <li key={address}>
      <span>{address}</span>
      <span>${numberFormat.format(volume)}</span>
    </li>
  )
}

export const Wallets = ({ tokens }: any) => {
  const classes = useStyles()
  const [darkMode] = useDarkModeManager()

  const [checked, setChecked] = useState(false)

  const [wallets, setWallets] = useState<WalletData[]>([createWalletData(0, 0)])
  const [renderedWallets, setRenderedWallets] = useState<JSX.Element[] | undefined>()

  useEffect(() => {
    const unique: string[] = []
    const newTokens = tokens
      .filter(({ symbol, logoURI }: any) => {
        if (!unique.includes(symbol) && logoURI) {
          unique.push(symbol)
          return true
        }
        return false
      })
      .map(({ address }: any) => createWalletData(address, Math.random() * 10000))
    setWallets(newTokens)
  }, [tokens])

  useEffect(() => {
    const renderResult: JSX.Element[] = []
    wallets.map((wallet, index) => renderResult.push(Wallet({ wallet, index })))
    setRenderedWallets(renderResult)
  }, [wallets])

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
        <div className={classes.walletsList}>{renderedWallets && renderedWallets.slice(0, 5)}</div>
        <Collapse in={checked}>
          <div className={classes.walletsList}>{renderedWallets && renderedWallets.slice(5)}</div>
        </Collapse>
        <IconButton className={classes.expand} onClick={handleChange}>
          {checked ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </div>
    </Paper>
  )
}
