import { makeStyles } from '@material-ui/core'
import React, { useEffect, useMemo, useState } from 'react'
import { useAllLists } from 'state/lists/hooks'
import { useFetchListCallback } from '../../hooks/useFetchListCallback'
import TokensTable from '../../components/TokensTable'
import InfoCard from '../../components/InfoCard'
import IconBanknotes from '../../icons/IconBanknotes'
import IconScales from '../../icons/IconScales'
import IconCoin from '../../icons/IconCoin'
import RiskMeter from '../../components/Riskmeter'
import { useWeb3React } from '@web3-react/core'
import {
  getAccountBalances,
  getAccountBorrowTotal,
  getAccountHoldingTotal,
  crossDeposit,
  crossWithdraw
} from '@marginswap/sdk'
import { TokenInfo } from '@uniswap/token-lists'
import { ErrorBar, WarningBar } from '../../components/Placeholders'
import { useActiveWeb3React } from '../../hooks'
import { getProviderOrSigner } from '../../utils'
import { BigNumber } from '@ethersproject/bignumber'
import { utils } from 'ethers'

const chainId = Number(process.env.REACT_APP_CHAIN_ID)

type AccountBalanceData = {
  img: string
  coin: string
  decimals: number
  address: string
  balance: number
  borrowed: number
  ir: number
}

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

const ACCOUNT_COLUMNS = [
  {
    name: 'Coin',
    id: 'coin',
    // eslint-disable-next-line react/display-name
    render: (token: AccountBalanceData) => (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img src={token.img} alt={token.coin} height={30} />
        <span style={{ marginLeft: '5px' }}>{token.coin}</span>
      </div>
    )
  },
  { name: 'Total Balance', id: 'balance' },
  // { name: 'Available', id: 'available' }, TODO
  { name: 'Borrowed', id: 'borrowed' },
  { name: 'Interest Rate', id: 'ir' }
] as const

export const MarginAccount = () => {
  const classes = useStyles()
  const [error, setError] = useState<string | null>(null)

  const lists = useAllLists()
  const fetchList = useFetchListCallback()
  const [tokens, setTokens] = useState<TokenInfo[]>([])
  const [holdingAmounts, setHoldingAmounts] = useState<Record<string, number>>({})
  const [borrowingAmounts, setBorrowingAmounts] = useState<Record<string, number>>({})
  const [holdingTotal, setHoldingTotal] = useState(0)
  const [debtTotal, setDebtTotal] = useState(0)

  const { account } = useWeb3React()
  const { library } = useActiveWeb3React()

  let provider: any
  if (library && account) {
    provider = getProviderOrSigner(library, account)
  }

  const ACCOUNT_ACTIONS = [
    {
      name: 'Borrow',
      onClick: (token: AccountBalanceData, amount: number) => {
        console.log('borrow', token)
        console.log('amount :>> ', amount)
      }
    },
    {
      name: 'Repay',
      onClick: (token: AccountBalanceData, amount: number) => {
        console.log('repay', token)
        console.log('amount :>> ', amount)
      }
    },
    {
      name: 'Withdraw',
      onClick: async (tokenInfo: AccountBalanceData, amount: number) => {
        try {
          await crossWithdraw(
            tokenInfo.address,
            utils.parseUnits(String(amount), tokenInfo.decimals).toHexString(),
            chainId,
            provider
          )
        } catch (error) {
          console.error(error)
        }
      },
      deriveMaxFrom: 'balance'
    },
    {
      name: 'Deposit',
      onClick: async (tokenInfo: AccountBalanceData, amount: number) => {
        try {
          await crossDeposit(
            tokenInfo.address,
            utils.parseUnits(String(amount), tokenInfo.decimals).toHexString(),
            chainId,
            provider
          )
        } catch (error) {
          console.error(error)
        }
      }
      // TODO: max
    }
  ] as const

  const getTokensList = async (url: string) => {
    const tokensRes = await fetchList(url, false)
    setTokens(tokensRes.tokens.filter(t => t.chainId === chainId))
  }
  useEffect(() => {
    getTokensList(Object.keys(lists)[0]).catch(e => {
      console.error(e)
      setError('Failed to get tokens list')
    })
  }, [lists])

  const getAccountData = async (_account: string) => {
    if (!library) {
      throw `Library uninitialized: ${library}, ${account}`
    }
    provider = getProviderOrSigner(library!, _account)
    const [balances, _holdingTotal, _debtTotal] = await Promise.all([
      getAccountBalances(_account, chainId, provider),
      getAccountHoldingTotal(_account, chainId, provider),
      getAccountBorrowTotal(_account, chainId, provider)
    ])
    setHoldingAmounts(
      Object.keys(balances.holdingAmounts).reduce(
        (acc, cur) => ({ ...acc, [cur]: BigNumber.from(balances.holdingAmounts[cur]).toString() }),
        {}
      )
    )
    setBorrowingAmounts(
      Object.keys(balances.borrowingAmounts).reduce(
        (acc, cur) => ({ ...acc, [cur]: BigNumber.from(balances.borrowingAmounts[cur]).toString() }),
        {}
      )
    )
    setHoldingTotal(BigNumber.from(_holdingTotal).toNumber())
    setDebtTotal(BigNumber.from(_debtTotal).toNumber())
  }
  const getData = () => {
    if (account) {
      getAccountData(account).catch(e => {
        console.error(e)
        setError('Failed to get account data')
      })
    }
  }
  useEffect(getData, [account])

  const data = useMemo(
    () =>
      tokens.map(token => {
        return {
          img: token.logoURI ?? '',
          coin: token.symbol,
          address: token.address,
          decimals: token.decimals,
          balance: Number(holdingAmounts[token.address] ?? 0) / Math.pow(10, token.decimals),
          borrowed: Number(borrowingAmounts[token.address] ?? 0) / Math.pow(10, token.decimals),
          ir: 0 // TODO
        }
      }),
    [tokens, holdingAmounts, borrowingAmounts]
  )

  const getRisk = (holding: number, debt: number): number => {
    if (debt === 0) return 0
    return Math.min(Math.max(((holding - debt) / debt - 1.1) * -41.6 + 10, 0), 10)
  }

  return (
    <div className={classes.wrapper}>
      <div className={classes.section}>
        {!account && <WarningBar>Wallet not connected</WarningBar>}
        {error && <ErrorBar>{error}</ErrorBar>}
        <div style={{ display: 'flex', justifyContent: 'space-between', margin: '20px 0', alignItems: 'center' }}>
          <InfoCard title="Total Account Balance" amount={holdingTotal} withUnderlyingCard Icon={IconBanknotes} />
          <InfoCard title="Debt" amount={debtTotal} small Icon={IconScales} />
          <InfoCard title="Equity" amount={holdingTotal - debtTotal} color="secondary" small Icon={IconCoin} />
          <RiskMeter risk={getRisk(holdingTotal, debtTotal)} />
        </div>
        <TokensTable
          title="Account balance"
          data={data}
          columns={ACCOUNT_COLUMNS}
          actions={ACCOUNT_ACTIONS}
          deriveEmptyFrom="balance"
          idCol="coin"
        />
      </div>
    </div>
  )
}
