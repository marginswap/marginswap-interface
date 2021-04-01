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
import { getAccountBalances, Balances, getAccountBorrowTotal, getAccountHoldingTotal } from '@marginswap/sdk'
import { TokenInfo } from '@uniswap/token-lists'
const { REACT_APP_CHAIN_ID } = process.env

export type AccountBalanceData = {
  img: string
  coin: string
  balance: number
  available: number
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

const ACCOUNT_ACTIONS = [
  {
    name: 'Borrow',
    onClick: (token: AccountBalanceData) => {
      console.log('borrow', token)
    },
    deriveMaxFrom: 'available'
  },
  {
    name: 'Repay',
    onClick: (token: AccountBalanceData) => {
      console.log('repay', token)
    },
    deriveMaxFrom: 'available'
  },
  {
    name: 'Withdraw',
    onClick: (token: AccountBalanceData) => {
      console.log('withdraw', token)
    },
    deriveMaxFrom: 'available'
  },
  {
    name: 'Deposit',
    onClick: (token: AccountBalanceData) => {
      console.log('deposit', token)
    },
    deriveMaxFrom: 'available'
  }
] as const

export const MarginAccount = () => {
  const classes = useStyles()
  const [error, setError] = useState<string | null>(null)

  const lists = useAllLists()
  const fetchList = useFetchListCallback()
  const [tokens, setTokens] = useState<TokenInfo[]>([])
  const [holdingAmounts, setHoldingAmounts] = useState<Balances>({})
  const [borrowingAmounts, setBorrowingAmounts] = useState<Balances>({})
  const [holdingTotal, setHoldingTotal] = useState(0)
  const [debtTotal, setDebtTotal] = useState(0)

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

  const { account } = useWeb3React()
  const getAccountData = async (_account: string) => {
    const [balances, _holdingTotal, _debtTotal] = await Promise.all([
      getAccountBalances(_account, Number(REACT_APP_CHAIN_ID)),
      getAccountHoldingTotal(_account, Number(REACT_APP_CHAIN_ID)),
      getAccountBorrowTotal(_account, Number(REACT_APP_CHAIN_ID))
    ])
    setHoldingAmounts(balances.holdingAmounts)
    setBorrowingAmounts(balances.borrowingAmounts)
    setHoldingTotal(_holdingTotal)
    setDebtTotal(_debtTotal)
  }
  useEffect(() => {
    if (account) {
      getAccountData(account).catch(e => {
        console.error(e)
        setError('Failed to get account data')
      })
    }
  }, [account])

  const data = useMemo(
    () =>
      tokens.map(token => ({
        img: token.logoURI ?? '',
        coin: token.symbol,
        balance: holdingAmounts[token.symbol] ?? 0,
        borrowed: borrowingAmounts[token.symbol] ?? 0,
        available: 0, // TODO
        ir: 0 // TODO
      })),
    [tokens, holdingAmounts, borrowingAmounts]
  )

  const getRisk = (holding: number, debt: number): number => {
    if (debt === 0) return 0
    return Math.min(Math.max(((holding - debt) / debt - 1.1) * -41.6 + 10, 0), 10)
  }

  return (
    <div className={classes.wrapper}>
      <div className={classes.section}>
        {!account && <div className={classes.warning}>Wallet not connected</div>}
        {error && <div className={classes.error}>{error}</div>}
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
