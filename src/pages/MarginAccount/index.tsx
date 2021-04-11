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
import { getAccountBalances, getAccountBorrowTotal, getAccountHoldingTotal } from '@marginswap/sdk'
import { TokenInfo } from '@uniswap/token-lists'
import { ErrorBar, WarningBar } from '../../components/Placeholders'
import { useActiveWeb3React } from '../../hooks'
import { getProviderOrSigner } from '../../utils'
import { BigNumber } from '@ethersproject/bignumber'
import { StyledTableContainer } from './styled'
import { StyledMobileOnlyRow} from './styled'
import { StyledWrapperDiv } from './styled'
import { StyledSectionDiv } from './styled'

const { REACT_APP_CHAIN_ID } = process.env

type AccountBalanceData = {
  img: string
  coin: string
  balance: number
  available: number
  borrowed: number
  ir: number
}

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
  const [error, setError] = useState<string | null>(null)

  const lists = useAllLists()
  const fetchList = useFetchListCallback()
  const [tokens, setTokens] = useState<TokenInfo[]>([])
  const [holdingAmounts, setHoldingAmounts] = useState<Record<string, number>>({})
  const [borrowingAmounts, setBorrowingAmounts] = useState<Record<string, number>>({})
  const [holdingTotal, setHoldingTotal] = useState(0)
  const [debtTotal, setDebtTotal] = useState(0)

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
  let provider: any
  if (library && account) {
    provider = getProviderOrSigner(library, account)
  }

  const getAccountData = async (_account: string) => {
    const [balances, _holdingTotal, _debtTotal] = await Promise.all([
      getAccountBalances(_account, Number(REACT_APP_CHAIN_ID), provider),
      getAccountHoldingTotal(_account, Number(REACT_APP_CHAIN_ID), provider),
      getAccountBorrowTotal(_account, Number(REACT_APP_CHAIN_ID), provider)
    ])
    setHoldingAmounts(
      Object.keys(balances.holdingAmounts).reduce(
        (acc, cur) => ({ ...acc, [cur]: BigNumber.from(balances.holdingAmounts[cur]).toNumber() }),
        {}
      )
    )
    setBorrowingAmounts(
      Object.keys(balances.borrowingAmounts).reduce(
        (acc, cur) => ({ ...acc, [cur]: BigNumber.from(balances.borrowingAmounts[cur]).toNumber() }),
        {}
      )
    )
    setHoldingTotal(BigNumber.from(_holdingTotal).toNumber())
    setDebtTotal(BigNumber.from(_debtTotal).toNumber())
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
    <StyledWrapperDiv >
      <StyledSectionDiv >
        {!account && <WarningBar>Wallet not connected</WarningBar>}
        {error && <ErrorBar>{error}</ErrorBar>}
        <StyledTableContainer>
          <InfoCard title="Total Account Balance" amount={holdingTotal} withUnderlyingCard Icon={IconBanknotes} />
          <StyledMobileOnlyRow >
            <InfoCard title="Debt" amount={debtTotal} small Icon={IconScales} />
            <InfoCard title="Equity" amount={holdingTotal - debtTotal} color="secondary" small Icon={IconCoin} />
          </StyledMobileOnlyRow>
          <RiskMeter risk={getRisk(holdingTotal, debtTotal)} />
        </StyledTableContainer>
      <TokensTable
        title="Account balance"
        data={data}
        columns={ACCOUNT_COLUMNS}
        actions={ACCOUNT_ACTIONS}
        deriveEmptyFrom="balance"
        idCol="coin"
      />
      </StyledSectionDiv>
    </StyledWrapperDiv>
  )
}
