import React, { useEffect, useState } from 'react'
import Collapse from '@material-ui/core/Collapse'
import { makeStyles, Paper } from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import { DateTime } from 'luxon'
import { CustomLightSpinner } from '../../theme'
import IconButton from '@material-ui/core/IconButton'
import Circle from '../../assets/images/blue-loader.svg'
import { polygonClient } from '../../config/apollo-config'
import { avalancheClient } from '../../config/apollo-config'
//import { bscClient } from '../../config/apollo-config'

import { getTopTraders } from './utils'

import { useSwapsQuery } from '../../graphql/queries/analytics'

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

type TopTradersProps = {
  trader: string
  volume: number
}

export const Wallets = () => {
  const classes = useStyles()
  const [checked, setChecked] = useState(true)
  const [topTraders, setTopTraders] = useState<TopTradersProps[]>([])

  const gteValue = Math.round(
    DateTime.fromISO(DateTime.now().toString(), { zone: 'utc' })
      .set({ hour: 0 })
      .set({ minute: 1 })
      .minus({ day: 1 })
      .toSeconds()
  )
  const lteValue = Math.round(DateTime.fromISO(DateTime.now().toString(), { zone: 'utc' }).toSeconds())

  const {
    loading: avaLoading,
    error: avaError,
    data: avalancheData
  } = useSwapsQuery({
    client: avalancheClient,
    variables: {
      gte: gteValue,
      lte: lteValue
    }
  })

  const {
    loading: polyLoading,
    error: polyError,
    data: polygonData
  } = useSwapsQuery({
    client: polygonClient,
    variables: {
      gte: gteValue,
      lte: lteValue
    }
  })

  /*const {
    loading: bscLoading,
    error: bscError,
    data: bscData
  } = useSwapsQuery({
    client: bscClient,
    variables: {
      gte: gteValue,
      lte: lteValue
    }
  })*/

  const swapsLoading = avaLoading && polyLoading //&& bscLoading
  const swapsError = avaError && polyError //&& bscError

  useEffect(() => {
    const getTraderData = async (polygonData: any, avalancheData: any /*bscData: any*/) => {
      const tradersData = await getTopTraders({
        polygonSwaps: polygonData || [],
        avalancheSwaps: avalancheData || []
        /*bscSwaps: bscData || []*/
      })
      setTopTraders(tradersData)
    }

    if (!swapsLoading && !swapsError) {
      getTraderData(polygonData?.swaps || [], avalancheData?.swaps || [] /*bscData?.swaps || []*/)
    }
  }, [polygonData, avalancheData /*bscData*/])

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
        {polyLoading || avaLoading /*|| bscLoading*/ ? (
          <CustomLightSpinner src={Circle} alt="loader" size={'90px'} />
        ) : polyError || avaError /*|| bscError*/ ? (
          <div> Error! </div>
        ) : (
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
        )}
      </div>
    </Paper>
  )
}
