import { makeStyles } from '@material-ui/core'
import { useAllLists } from 'state/lists/hooks'
import React, { useEffect, useState } from 'react'
import { useFetchListCallback } from '../../hooks/useFetchListCallback'
import { TokenInfo } from '@uniswap/token-lists'
import { PagerSwap } from '../../components/PagerSwap'
import { useWeb3React } from '@web3-react/core'
import { ErrorBar, WarningBar } from '../../components/Placeholders'

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

// mock stuff
const exchangeRates = {
  WBTC_DAI: 1,
  WBTC_USDT: 2,
  WBTC_USDC: 3,
  WBTC_BOND: 4,
  WBTH_WETH: 5,
  DAI_USDT: 2,
  DAI_USDC: 3,
  DAI_BOND: 5,
  DAI_WETH: 6,
  USDT_USDC: 1.2,
  USDT_BOND: 2.53,
  USDT_WETH: 3.4,
  USDC_BOND: 3,
  USDC_WETH: 5,
  BOND_WETH: 8
}

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
        {!account && <WarningBar>Wallet not connected</WarningBar>}
        {error && <ErrorBar>{error}</ErrorBar>}
        {/* TODO: add real balances */}
        <PagerSwap
          tokens={tokens.map(t => ({
            ...t,
            ...(account
              ? {
                  balance: Math.round(Math.random() * 1000000) / 1000000,
                  borrowable: Math.round(Math.random() * 100)
                }
              : {})
          }))}
          exchangeRates={exchangeRates}
          accountConnected={!!account}
        />
      </div>
    </div>
  )
}
