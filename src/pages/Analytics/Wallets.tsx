import React, { useEffect, useState } from 'react'
import Collapse from '@material-ui/core/Collapse'
import { makeStyles, Paper } from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import IconButton from '@material-ui/core/IconButton'

export const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    justifyContent: 'space-between',
    borderBottom: '2px solid gray',
    padding: '10px 0',
    fontSize: '13px',
    lineHeight: '16px'
  },
  main: {
    width: '1040px',
    backdropFilter: 'blur(10px)',
    background: '#212429',
    boxShadow:
      '0px 0px 1px rgb(0 0 0 / 1%), 0px 4px 8px rgb(0 0 0 / 4%), 0px 16px 24px rgb(0 0 0 / 4%), 0px 24px 32px rgb(0 0 0 / 1%)',
    borderRadius: '10px',
    color: '#fff'
  },
  container: {
    display: 'flex',
    margin: '12px 27px 0 60px',
    flexDirection: 'column'
  },
  walletsList: {
    '& li': {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '3px solid #80808033',
      padding: '10px 0 16px 0',
      '& span': {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        fontSize: '12px',
        lineHeight: '15px'
      }
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
      className={classes.main}
    >
      <div className={classes.container}>
        <h3>Top Traders</h3>
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
