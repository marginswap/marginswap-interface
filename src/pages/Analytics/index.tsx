import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core'
import { Graphics } from './Graphics'
import { Stats } from './Stats'
import { Wallets } from './Wallets'
import { TokenInfo } from '@uniswap/token-lists'
import { useFetchListCallback } from 'hooks/useFetchListCallback'
import { useAllLists } from 'state/lists/hooks'

const useStyles = makeStyles(() => ({
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    padding: '0 20px',
    gap: '20px',
    '& h2': {
      width: '1040px'
    }
  },
  stats: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '30px',
    width: '1040px',
    '& p': {
      margin: '10px 0',
      fontWeight: 600,
      fontSize: '15px'
    }
  }
}))

export const Analytics = () => {
  const classes = useStyles()

  const lists = useAllLists()
  const [tokens, setTokens] = useState<TokenInfo[]>([])

  const fetchList = useFetchListCallback()

  useEffect(() => {
    const url = Object.keys(lists)[0]
    if (url) {
      fetchList(url, false)
        .then(({ tokens }) => {
          setTokens(tokens)
        })
        .catch(error => console.error('interval list fetching error', error))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className={classes.wrapper}>
      <h2>MarginSwap Analytics</h2>
      <Graphics />
      <div className={classes.stats}>
        <Stats title={'MFI Price'} time={'Last 24 hrs'} value={'$1,594'} chartColor={'#BE72F3'} />
        <Stats title={'Total Fees'} time={'Ever Collected'} value={'$1,10,284'} chartColor={'#94F572'} />
        <Stats title={'Fees'} time={'Last 24 hrs'} value={'$12,000'} chartColor={'#F90B0B'} />
        <Stats title={'Total Volume'} time={'Last 24 hrs'} value={'1,10,284'} chartColor={'#F99808'} />
        <Stats title={'Total Bond Lending'} value={'0.5m'} />
        <Stats title={'Total Borrowed'} value={'0.5m'} />
      </div>
      <Wallets tokens={tokens} />
    </div>
  )
}
