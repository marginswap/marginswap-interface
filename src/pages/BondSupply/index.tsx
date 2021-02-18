import React, { useState, useEffect } from 'react'
import { makeStyles, Theme } from '@material-ui/core'
import BondHoldingsTable from 'components/BondHoldings'
import { TokenInfo } from '@uniswap/token-lists'
import { useAllLists } from 'state/lists/hooks'
import { useFetchListCallback } from './../../hooks/useFetchListCallback'
const useStyles = makeStyles((theme: Theme) => ({
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    padding: '0 20px',
    gap: '20px'
  }
}))

export const BondSupply = () => {
  const classes = useStyles()

  const lists = useAllLists()
  const [tokens, setTokens] = useState<TokenInfo[]>([])

  const fetchList = useFetchListCallback()

  useEffect(() => {
    const url = Object.keys(lists)[0]
    if (url) {
      fetchList(url, false)
        .then(({ tokens }) => setTokens(tokens))
        .catch(error => console.debug('interval list fetching error', error))
    }
    // eslint-disable-next-line
  }, [])

  return (
    <div className={classes.wrapper}>
      <BondHoldingsTable tokens={tokens} />
      <div>B</div>
    </div>
  )
}
