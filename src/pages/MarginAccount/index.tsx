import { makeStyles } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { useAllLists } from 'state/lists/hooks'
import { useFetchListCallback } from '../../hooks/useFetchListCallback'
import { TotalBalance } from 'components/TotalBalance'
import TokensTable from '../../components/TokensTable'

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
  const classes = useStyles()

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

  return (
    <div className={classes.wrapper}>
      <div className={classes.section}>
        <TotalBalance />
        <TokensTable
          title="Account balance"
          data={rows}
          columns={ACCOUNT_COLUMNS}
          actions={ACCOUNT_ACTIONS}
          deriveEmptyFrom="available"
          idCol="coin"
        />
      </div>
    </div>
  )
}
