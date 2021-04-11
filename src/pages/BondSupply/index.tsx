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
import { getProviderOrSigner } from '../../utils'
import {
  getHourlyBondBalances,
  getHourlyBondInterestRates,
  getHourlyBondMaturities,
  buyHourlyBondSubscription,
  getBondsCostInDollars
} from '@marginswap/sdk'
import { ErrorBar, WarningBar } from '../../components/Placeholders'
import { BigNumber } from '@ethersproject/bignumber'
import { useETHBalances } from '../../state/wallet/hooks'
const { REACT_APP_CHAIN_ID } = process.env

type BondRateData = {
  img: string
  coin: string
  address: string
  totalSupplied: number
  apy: number
  maturity: number
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
  { name: 'Total Supplied', id: 'totalSupplied' },
  { name: 'APY', id: 'apy' },
  { name: 'Maturity', id: 'maturity' }
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

const apyFromApr = (apr: number, compounds: number): number =>
  (Math.pow(1 + apr / (compounds * 100), compounds) - 1) * 100

const BondSupply = () => {
  const classes = useStyles()
  const [error, setError] = useState<string | null>(null)

  const lists = useAllLists()
  const fetchList = useFetchListCallback()
  const [tokens, setTokens] = useState<TokenInfo[]>([])
  const [bondBalances, setBondBalances] = useState<Record<string, number>>({})
  const [bondInterestRates, setBondInterestRates] = useState<Record<string, number>>({})
  const [bondMaturities, setBondMaturities] = useState<Record<string, number>>({})
  const [bondUSDCosts, setBondUSDCosts] = useState<Record<string, number>>({})

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
  const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? '']
  const { library } = useActiveWeb3React()
  let provider: any
  if (library && account) {
    provider = getProviderOrSigner(library, account)
  }

  const getBondsData = async (address: string, tokens: string[]) => {
    // TODO get chain id from somewhere other than the env variable. Perhaps the wallet/provider?
    const [balances, interestRates, maturities, bondCosts] = await Promise.all([
      getHourlyBondBalances(address, tokens, Number(REACT_APP_CHAIN_ID), provider),
      getHourlyBondInterestRates(tokens, Number(REACT_APP_CHAIN_ID), provider),
      getHourlyBondMaturities(address, tokens, Number(REACT_APP_CHAIN_ID), provider),
      getBondsCostInDollars(address, tokens, Number(REACT_APP_CHAIN_ID), provider)
    ])
    setBondBalances(
      Object.keys(balances).reduce((acc, cur) => ({ ...acc, [cur]: BigNumber.from(balances[cur]).toNumber() }), {})
    )
    setBondInterestRates(
      Object.keys(interestRates).reduce(
        (acc, cur) => ({ ...acc, [cur]: apyFromApr(BigNumber.from(interestRates[cur]).toNumber() / 100000, 365 * 24) }),
        {}
      )
    )
    setBondMaturities(
      Object.keys(maturities).reduce((acc, cur) => ({ ...acc, [cur]: BigNumber.from(maturities[cur]).toNumber() }), {})
    )
    setBondUSDCosts(
      Object.keys(bondCosts).reduce((acc, cur) => ({ ...acc, [cur]: BigNumber.from(bondCosts[cur]).toNumber() }), {})
    )
  }

  const getData = () => {
    if (account && tokens.length > 0) {
      getBondsData(
        account,
        tokens.map(t => t.address)
      ).catch(e => {
        console.error(e)
        setError('Failed to get account data')
      })
    }
  }
  useEffect(getData, [account, tokens])

  const actions = [
    {
      name: 'Deposit',
      onClick: async (token: BondRateData, amount: number) => {
        if (!amount) return
        try {
          await buyHourlyBondSubscription(token.address, amount, Number(REACT_APP_CHAIN_ID), provider)
          getData()
        } catch (e) {
          console.error(e)
        }
      },
      max: userEthBalance ? Number(userEthBalance.toSignificant()) : undefined
    },
    {
      name: 'Withdraw',
      onClick: (token: BondRateData, amount: number) => {
        console.log('withdraw', token)
        console.log('amount :>> ', amount)
      },
      deriveMaxFrom: 'totalSupplied'
    }
  ] as const

  const data = useMemo(
    () =>
      tokens.map(token => ({
        img: token.logoURI ?? '',
        address: token.address,
        coin: token.symbol,
        totalSupplied: bondBalances[token.address] ?? 0,
        apy: bondInterestRates[token.address] ?? 0,
        maturity: bondMaturities[token.address] ?? 0
      })),
    [tokens, bondBalances]
  )

  return (
    <div className={classes.wrapper}>
      <div className={classes.section}>
        {!account && <WarningBar>Wallet not connected</WarningBar>}
        {error && <ErrorBar>{error}</ErrorBar>}
        <div style={{ display: 'flex', justifyContent: 'space-between', margin: '20px 0' }}>
          <InfoCard
            title="Total Bond"
            amount={Object.keys(bondUSDCosts).reduce((acc, cur) => acc + bondUSDCosts[cur], 0)}
            Icon={IconMoneyStackLocked}
          />
          <InfoCard title="Average Yield" amount={0.123456} ghost Icon={IconMoneyStackLocked} />
          <InfoCard title="Earnings per day" amount={0.123456} color="secondary" ghost Icon={IconMoneyStack} />
        </div>
        <TokensTable title="Bond Rates" data={data} columns={BOND_RATES_COLUMNS} idCol="coin" actions={actions} />
      </div>
    </div>
  )
}

export default BondSupply
