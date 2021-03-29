import React, { useEffect, useState } from 'react'
import { useAllLists } from 'state/lists/hooks'
import { useFetchListCallback } from '../../hooks/useFetchListCallback'
import TokensTable from '../../components/TokensTable'
import InfoCard from '../../components/InfoCard'
import IconBanknotes from '../../icons/IconBanknotes'
import IconScales from '../../icons/IconScales'
import IconCoin from '../../icons/IconCoin'
import RiskMeter from '../../components/Riskmeter'
import styled from 'styled-components'

export type AccountBalanceData = {
  img: string
  coin: string
  balance: number
  available: number
  borrowed: number
  ir: number
}

const MarginAccountWrapper = styled.div`
  display: flex;
  flex-direction: row;
  padding-left: 20px;
`

const MarginAccountSection = styled.div`
  display: flex;
  flex-direction: column;
  padding-right: 20px;
  gap: 20px;
  & h3 span td p {
    color: ${({ theme }) => theme.text1};
  }
`

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
  { name: 'Available', id: 'available' },
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

// Mock stuff, probably should be removed
export function createAccountBalanceData(
  img: string,
  coin: string,
  balance: number,
  available: number,
  borrowed: number,
  ir: number
): AccountBalanceData {
  return {
    img,
    coin,
    balance,
    available,
    borrowed,
    ir
  }
}

export const MarginAccount = () => {
  //mock stuff, should be removed
  const lists = useAllLists()
  const [rows, setRows] = useState([createAccountBalanceData('', '', 0, 0, 0, 0)])
  const fetchList = useFetchListCallback()
  useEffect(() => {
    const url = Object.keys(lists)[0]
    if (url) {
      fetchList(url, false)
        .then(({ tokens }) => {
          const unique: string[] = []
          const newTokens = tokens
            .filter(({ symbol, logoURI }: any) => {
              if (!unique.includes(symbol) && logoURI) {
                unique.push(symbol)
                return true
              }
              return false
            })
            .map(({ logoURI, symbol }: any) =>
              createAccountBalanceData(logoURI, symbol, Math.random(), Math.random(), Math.random(), Math.random())
            )
          setRows(newTokens)
        })
        .catch(error => console.error('interval list fetching error', error))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const [risk] = useState(Math.round(Math.random() * 100) / 10)

  return (
    <MarginAccountWrapper>
      <MarginAccountSection>
        <div style={{ display: 'flex', justifyContent: 'space-between', margin: '20px 0', alignItems: 'center' }}>
          <InfoCard title="Total Account Balance" amount={0.123456} withUnderlyingCard Icon={IconBanknotes} />
          <InfoCard title="Debt" amount={0.123456} small Icon={IconScales} />
          <InfoCard title="Equity" amount={0.123456} color="secondary" small Icon={IconCoin} />
          <RiskMeter risk={risk} />
        </div>
        <TokensTable
          title="Account balance"
          data={rows}
          columns={ACCOUNT_COLUMNS}
          actions={ACCOUNT_ACTIONS}
          deriveEmptyFrom="available"
          idCol="coin"
        />
      </MarginAccountSection>
    </MarginAccountWrapper>
  )
}
