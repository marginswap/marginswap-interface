import { makeStyles } from '@material-ui/core'
import { useAllLists } from 'state/lists/hooks'
import React, { useEffect, useState, useMemo } from 'react'
import { useFetchListCallback } from '../../hooks/useFetchListCallback'
import { TokenInfo } from '@uniswap/token-lists'
import { PagerSwap } from '../../components/PagerSwap'
import { useWeb3React } from '@web3-react/core'
import { ErrorBar, WarningBar } from '../../components/Placeholders'
import { useTokenBalances } from '../../state/wallet/hooks'
import { Token } from '@marginswap/sdk'
import { useMultipleContractSingleData } from '../../state/multicall/hooks'
import ERC20_INTERFACE from '../../constants/abis/erc20'
import { SPOT_ROUTER_ADDRESS } from '../../constants'

const { REACT_APP_CHAIN_ID } = process.env

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
  BOND_WETH: 8,
  UNI_DAI: 3.2,
  UNI_WETH: 3.9
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
    setTokens(tokensRes.tokens.filter(t => t.chainId === Number(REACT_APP_CHAIN_ID)))
  }
  useEffect(() => {
    getTokensList(Object.keys(lists)[0]).catch(e => {
      console.error(e)
      setError('Failed to get tokens list')
    })
  }, [lists])

  const formattedTokens = useMemo(
    () =>
      tokens.length > 0
        ? tokens.map(token => new Token(token.chainId, token.address, token.decimals, token.symbol, token.name))
        : [],
    [tokens]
  )

  const tokenBalances = useTokenBalances(account ?? undefined, formattedTokens)

  const validatedTokenAddresses = useMemo(() => formattedTokens.map(vt => vt.address), [formattedTokens])

  const spotRouterAllowances = useMultipleContractSingleData(validatedTokenAddresses, ERC20_INTERFACE, 'allowance', [
    account ?? undefined,
    SPOT_ROUTER_ADDRESS
  ])

  const marginRouterAllowances = useMultipleContractSingleData(validatedTokenAddresses, ERC20_INTERFACE, 'allowance', [
    account ?? undefined,
    SPOT_ROUTER_ADDRESS
  ])

  return (
    <div className={classes.wrapper}>
      <div className={classes.section}>
        {!account && <WarningBar>Wallet not connected</WarningBar>}
        {error && <ErrorBar>{error}</ErrorBar>}
        <PagerSwap
          tokens={tokens.map((t, index) => ({
            ...t,
            ...(account
              ? {
                  balance: Number(tokenBalances[t.address]?.toSignificant(4)) ?? 0,
                  isSpotApproved: spotRouterAllowances[index]?.result?.[0].isZero() ? true : false,
                  isMarginApproved: marginRouterAllowances[index]?.result?.[0].isZero() ? true : false,
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
