import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core'
import BondHoldingsTable from 'components/BondHoldings'
import BondRateTable from 'components/BondRate'
import { TokenInfo } from '@uniswap/token-lists'
import { useAllLists } from 'state/lists/hooks'
import { useFetchListCallback } from './../../hooks/useFetchListCallback'

const useStyles = makeStyles(() => ({
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    width: '75%',
    paddingRight: '20px',
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
        .then(({ tokens }) => {
          setTokens(tokens)
        })
        .catch(error => console.error('interval list fetching error', error))
    }
    // eslint-disable-next-line
  }, [])

  return (
    <div className={classes.wrapper}>
      <BondHoldingsTable tokens={tokens} />
      <BondRateTable tokens={tokens} />
    </div>
  )
}
