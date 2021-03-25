import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core'
import { useAllLists } from 'state/lists/hooks'
import { useFetchListCallback } from '../../hooks/useFetchListCallback'
import { AccountBalanceData, createAccountBalanceData } from '../MarginAccount'
import TokensTable from '../../components/TokensTable'
import InfoCard from '../../components/InfoCard'
import IconMoneyStackLocked from '../../icons/IconMoneyStackLocked'
import IconMoneyStack from '../../icons/IconMoneyStack'

type BondRateData = {
  img: string
  coin: string
  daily: number
  weekly: number
  monthly: number
  yearly: number
}

const BOND_HOLDINGS_COLUMNS = [
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
  { name: 'Daily', id: 'daily' },
  { name: 'Weekly', id: 'weekly' },
  { name: 'Mothnly', id: 'monthly' },
  { name: 'Yearly', id: 'yearly' }
] as const

const BOND_HOLDINGS_ACTIONS = [
  {
    name: 'Withdraw',
    onClick: (token: AccountBalanceData) => {
      console.log('withdraw', token)
    },
    deriveMaxFrom: 'available'
  }
] as const

const useStyles = makeStyles(() => ({
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    width: '75%',
    paddingRight: '20px',
    gap: '20px'
  }
}))

// mock stuff, should be removed
function createBondRateData(
  img: string,
  coin: string,
  daily: number,
  weekly: number,
  monthly: number,
  yearly: number
): BondRateData {
  return {
    img,
    coin,
    daily,
    weekly,
    monthly,
    yearly
  }
}

export const BondSupply = () => {
  const classes = useStyles()

  //mock stuff, should be removed
  const lists = useAllLists()
  const [bondHoldingsRows, setBondHoldingsRows] = useState([createAccountBalanceData('', '', 0, 0, 0, 0)])
  const [bondRatesRows, setBondRatesRows] = useState([createBondRateData('', '', 0, 0, 0, 0)])
  const fetchList = useFetchListCallback()
  useEffect(() => {
    const url = Object.keys(lists)[0]
    if (url) {
      fetchList(url, false)
        .then(({ tokens }) => {
          const unique: string[] = []
          const newTokens = tokens.filter(({ symbol, logoURI }: any) => {
            if (!unique.includes(symbol) && logoURI) {
              unique.push(symbol)
              return true
            }
            return false
          })
          setBondHoldingsRows(
            newTokens.map(({ logoURI, symbol }: any) =>
              createAccountBalanceData(logoURI, symbol, Math.random(), Math.random(), Math.random(), Math.random())
            )
          )
          setBondRatesRows(
            newTokens.map(({ logoURI, symbol }: any) =>
              createBondRateData(logoURI, symbol, Math.random(), Math.random(), Math.random(), Math.random())
            )
          )
        })
        .catch(error => console.error('interval list fetching error', error))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className={classes.wrapper}>
      <div style={{ display: 'flex', justifyContent: 'space-between', margin: '20px 0' }}>
        <InfoCard title="Bond Holding" amount={0.123456} Icon={IconMoneyStackLocked} />
        <InfoCard title="Current Earnings" amount={0.123456} ghost Icon={IconMoneyStackLocked} />
        <InfoCard title="Total Earned" amount={0.123456} color="secondary" ghost Icon={IconMoneyStack} />
      </div>
      <TokensTable
        title="Bond Holdings"
        data={bondHoldingsRows}
        columns={BOND_HOLDINGS_COLUMNS}
        actions={BOND_HOLDINGS_ACTIONS}
        deriveEmptyFrom="available"
        idCol="coin"
      />
      <TokensTable title="Bond Rates" data={bondRatesRows} columns={BOND_RATES_COLUMNS} idCol="coin" />
    </div>
  )
}
