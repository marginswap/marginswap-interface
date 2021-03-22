import React, { useEffect, useState } from 'react'
import { useAllLists } from 'state/lists/hooks'
import { TokenInfo } from '@uniswap/token-lists'
import { useFetchListCallback } from 'hooks/useFetchListCallback'
import AccountBalanceTable from 'components/AccountBalance'
import { Staking } from 'components/Staking'
import BondHoldingsTable from 'components/BondHoldings'

const Develop = () => {
  const lists = useAllLists()
  const [tokens, setTokens] = useState<TokenInfo[]>([])
  const fetchList = useFetchListCallback()

  useEffect(() => {
    const url = Object.keys(lists)[0]
    if (url) {
      fetchList(url, false)
        .then(({ tokens }) => setTokens(tokens))
        .catch(error => console.error('interval list fetching error', error))
    }
    // eslint-disable-next-line
  }, [])

  return (
    <div style={{ width: '80%', margin: 'auto', padding: 40 }}>
      <BondHoldingsTable tokens={tokens || []} />
      <AccountBalanceTable tokens={tokens || []} />
      <Staking />
    </div>
  )
}

export default Develop
