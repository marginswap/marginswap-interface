import React from 'react'

export type BondRateDataType = {
  img: string
  coin: string
  address: string
  decimals: number
  totalSupplied: number
  apy: number
  aprWithIncentive: number
  maturity: number
  available: number
}

export const DATA_POLLING_INTERVAL = 60 * 1000

export const BOND_RATES_COLUMNS = [
  {
    name: 'Coin',
    id: 'coin',
    // eslint-disable-next-line react/display-name
    render: (token: BondRateDataType) => (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img src={token.img} alt={token.coin} height={30} />
        <span style={{ marginLeft: '5px' }}>{token.coin}</span>
      </div>
    )
  },
  {
    name: 'Total Supplied',
    id: 'totalSupplied',
    // eslint-disable-next-line react/display-name
    render: ({ totalSupplied }: { totalSupplied: number }) => (
      <span>{totalSupplied ? totalSupplied.toFixed(2) : 0}</span>
    )
  },
  {
    name: 'APY',
    id: 'apy',
    // eslint-disable-next-line react/display-name
    render: ({ apy }: { apy: number }) => <span>{apy ? `${apy.toFixed(2)}%` : 0}</span>
  },
  {
    name: 'APR Including Incentive',
    id: 'aprWithIncentive',
    // eslint-disable-next-line react/display-name
    render: ({ aprWithIncentive }: { aprWithIncentive: number }) => (
      <span>{aprWithIncentive ? `${aprWithIncentive.toFixed(2)}%` : 0}</span>
    )
  },
  { name: 'Maturity (minutes remaining)', id: 'maturity' }
] as const

export const apyFromApr = (apr: number, compounds: number): number =>
  (Math.pow(1 + apr / (compounds * 100), compounds) - 1) * 100
