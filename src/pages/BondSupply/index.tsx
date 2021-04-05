import React, { useState, useEffect, useMemo } from 'react'
import { makeStyles } from '@material-ui/core'
import { useAllLists } from 'state/lists/hooks'
import { useFetchListCallback } from '../../hooks/useFetchListCallback'
import TokensTable from '../../components/TokensTable'
import InfoCard from '../../components/InfoCard'
import IconMoneyStackLocked from '../../icons/IconMoneyStackLocked'
import IconMoneyStack from '../../icons/IconMoneyStack'
import { TokenInfo } from '@uniswap/token-lists'
import { useWeb3React } from '@web3-react/core'
import { useActiveWeb3React } from '../../hooks'
import { Web3Provider } from '@ethersproject/providers'
import { getProviderOrSigner } from '../../utils'
import { getHourlyBondBalances, getHourlyBondInterestRates } from '@marginswap/sdk'
import { ErrorBar, WarningBar } from '../../components/Placeholders'
import { BigNumber } from '@ethersproject/bignumber'
const { REACT_APP_CHAIN_ID } = process.env

type BondRateData = {
  img: string
  coin: string
  hourly: number
  ir: number
  // daily: number
  // weekly: number
  // monthly: number
  // yearly: number
}

const BOND_RATES_COLUMNS = [
  {
    name: 'Coin',
    id: 'coin',
    // eslint-disable-next-line react/display-name
    render: (token: BondRateData) => (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img src={token.img} alt={token.coin} height={30} />
        <span style={{ marginLeft: '5px' }}>{token.coin}</span>
      </div>
    )
  },
  { name: 'Hourly', id: 'hourly' },
  // { name: 'Daily', id: 'daily' },
  // { name: 'Weekly', id: 'weekly' },
  // { name: 'Mothnly', id: 'monthly' },
  // { name: 'Yearly', id: 'yearly' },
  { name: 'Interest Rate', id: 'ir' }
] as const

const useStyles = makeStyles(() => ({
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    width: '75%',
    paddingRight: '20px',
    gap: '20px'
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    paddingRight: '20px',
    gap: '20px'
  }
}))

export const BondSupply = () => {
  const classes = useStyles()
  const [error, setError] = useState<string | null>(null)

  const lists = useAllLists()
  const fetchList = useFetchListCallback()
  const [tokens, setTokens] = useState<TokenInfo[]>([])
  const [bondHourlyBalances, setBondHourlyBalances] = useState<Record<string, number>>({})
  const [bondInterestRates, setBondInterestRates] = useState<Record<string, number>>({})

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

  const { account } = useWeb3React()
  const { library } = useActiveWeb3React()
  let provider: Web3Provider
  if (library && account) {
    provider = getProviderOrSigner(library, account) as Web3Provider
  }

  const getBondBalances = async (address: string, tokens: string[]) => {
    const [hourlyRates, interestRates] = await Promise.all([
      getHourlyBondBalances(address, tokens, Number(REACT_APP_CHAIN_ID), provider),
      getHourlyBondInterestRates(tokens, Number(REACT_APP_CHAIN_ID), provider)
    ])
    setBondHourlyBalances(
      Object.keys(hourlyRates).reduce(
        (acc, cur) => ({ ...acc, [cur]: BigNumber.from(hourlyRates[cur]).toNumber() }),
        {}
      )
    )
    setBondInterestRates(
      Object.keys(interestRates).reduce(
        (acc, cur) => ({ ...acc, [cur]: BigNumber.from(interestRates[cur]).toNumber() }),
        {}
      )
    )
  }
  useEffect(() => {
    if (account && tokens.length > 0) {
      getBondBalances(
        account,
        tokens.map(t => t.address)
      ).catch(e => {
        console.error(e)
        setError('Failed to get account data')
      })
    }
  }, [account, tokens])

  const data = useMemo(
    () =>
      tokens.map(token => ({
        img: token.logoURI ?? '',
        coin: token.symbol,
        hourly: bondHourlyBalances[token.address] ?? 0,
        ir: bondInterestRates[token.address] ?? 0
        // daily: 0, // TODO
        // weekly: 0, // TODO
        // monthly: 0, // TODO
        // yearly: 0 // TODO
      })),
    [tokens, bondHourlyBalances]
  )

  return (
    <div className={classes.wrapper}>
      <div className={classes.section}>
        {!account && <WarningBar>Wallet not connected</WarningBar>}
        {error && <ErrorBar>{error}</ErrorBar>}
        <div style={{ display: 'flex', justifyContent: 'space-between', margin: '20px 0' }}>
          <InfoCard title="Bond Holding" amount={0.123456} Icon={IconMoneyStackLocked} />
          <InfoCard title="Current Earnings" amount={0.123456} ghost Icon={IconMoneyStackLocked} />
          <InfoCard title="Total Earned" amount={0.123456} color="secondary" ghost Icon={IconMoneyStack} />
        </div>
        <TokensTable title="Bond Rates" data={data} columns={BOND_RATES_COLUMNS} idCol="coin" />
      </div>
    </div>
  )
}
