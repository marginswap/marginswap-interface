import { makeStyles } from '@material-ui/core'
import { useAllLists } from 'state/lists/hooks'
import React, { useEffect, useState } from 'react'
import { useFetchListCallback } from './../../hooks/useFetchListCallback'
import { TokenInfo } from '@uniswap/token-lists'
import { PagerSwap } from './../../components/PagerSwap/index'

const useStyles = makeStyles(() => ({
  wrapper: {
    display: 'flex',
    flexDirection: 'row',
    paddingLeft: '20px'
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    paddingRight: '20px',
    gap: '20px'
  }
}))

export default function Swap() {
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
      <div className={classes.section}>
        <PagerSwap tokens={tokens} />
      </div>
    </div>
  )
}
