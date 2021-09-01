import React, { useEffect, useState } from 'react'
import Collapse from '@material-ui/core/Collapse'
import { makeStyles, Paper } from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import IconButton from '@material-ui/core/IconButton'

import { getTopTraders } from './utils'
import { VolumeSwaps } from './utils'

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
    background: 'inherit',
    boxShadow:
      '0px 0px 1px rgb(0 0 0 / 1%), 0px 4px 8px rgb(0 0 0 / 4%), 0px 16px 24px rgb(0 0 0 / 4%), 0px 24px 32px rgb(0 0 0 / 1%)',
    borderRadius: '10px',
    border: '1px solid #777777',
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

const Wallet = (wallet: WalletData) => {
  const numberFormat = new Intl.NumberFormat()
  const { address, volume } = wallet

  return (
    <li key={address}>
      <span>{address}</span>
      <span>${numberFormat.format(volume)}</span>
    </li>
  )
}

interface TopTradersProps {
  trader: string
  volume: number
}

type WalletProps = {
  swaps: VolumeSwaps
}

export const Wallets = ({ swaps }: WalletProps) => {
  const classes = useStyles()
  const [checked, setChecked] = useState(true)
  const [topTraders, setTopTraders] = useState<TopTradersProps[]>([])

  useEffect(() => {
    const getTraderData = async (polygonData: any, avalancheData: any, bscData: any, ethData: any) => {
      const tradersData = await getTopTraders({
        polygonData,
        avalancheData,
        bscData,
        ethData
      })
      setTopTraders(tradersData)
    }

    getTraderData(swaps.avalancheData || [], swaps.polygonData || [], swaps.bscData || [], swaps.ethData || [])
  }, [swaps])

  const handleChange = () => {
    setChecked(prev => !prev)
  }

  return (
    <Paper className={classes.main}>
      <div className={classes.container}>
        <h3>Top Traders</h3>
        <div className={classes.root}>
          <span>Wallet</span>
          <span>Volume (24hrs)</span>
        </div>
        <>
          <Collapse in={checked}>
            {topTraders.map(
              (trader: any) =>
                trader.volume > 0 && (
                  <div key={trader.trader} className={classes.walletsList}>
                    <Wallet address={trader.trader} volume={trader.volume} />
                  </div>
                )
            )}
          </Collapse>
          <IconButton className={classes.expand} onClick={handleChange}>
            {checked ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </>
      </div>
    </Paper>
  )
}
