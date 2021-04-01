import { makeStyles } from '@material-ui/core'
import { useAllLists } from 'state/lists/hooks'
import React, { useEffect, useState } from 'react'
import { useFetchListCallback } from '../../hooks/useFetchListCallback'
import { TokenInfo } from '@uniswap/token-lists'
import { PagerSwap } from '../../components/PagerSwap'
import { useWeb3React } from '@web3-react/core'

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
  },
  warning: {
    padding: '20px',
    color: 'orange',
    border: '1px solid yellow',
    borderRadius: '10px'
  },
  error: {
    padding: '20px',
    color: 'indianred',
    border: '1px solid red',
    borderRadius: '10px'
  }
}))

export default function Swap() {
  const classes = useStyles()
  const [error, setError] = useState<string | null>(null)
  const { account } = useWeb3React()

  const lists = useAllLists()
  const fetchList = useFetchListCallback()
  const [tokens, setTokens] = useState<TokenInfo[]>([])

  const getTokensList = async (url: string) => {
    const tokensRes = await fetchList(url, false)
    setTokens(tokensRes.tokens)
  }
  useEffect(() => {
    getTokensList(Object.keys(lists)[0]).catch(e => {
      console.error(e)
      setError('Failed to get tokens list')
    })
  }, [lists])

  return (
    <div className={classes.wrapper}>
      <div className={classes.section}>
        {!account && <div className={classes.warning}>Wallet not connected</div>}
        {error && <div className={classes.error}>{error}</div>}
        {/* TODO: add real balances */}
        <PagerSwap
          tokens={tokens.map(t => ({
            ...t,
            ...(account ? { balance: Math.round(Math.random() * 1000000) / 1000000 } : {})
          }))}
          accountConnected={!!account}
        />
      </div>
    </div>
  )
}
