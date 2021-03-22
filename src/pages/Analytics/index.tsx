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
    width: '100%',
    padding: '0 20px',
    gap: '20px',
    '& h2, h3, p': {
      marginLeft: '12px'
    }
  },
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
        .catch(error => console.debug('interval list fetching error', error))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className={classes.wrapper}>
      <h2>MarginSwap Analytics</h2>
      <Stats ethPrice={1594} transactions={110284} fees={5313268} totalVolume={26} />
      <Graphics />
      <h3>Top Traders</h3>
      <Wallets tokens={tokens} />
    </div>
  )
}
