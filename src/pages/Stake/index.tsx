import React from 'react'
import TradeStake from '../../components/stake/Trade'

import { useActiveWeb3React } from '../../hooks'
import useENS from '../../hooks/useENS'

export default function Stake() {
  const { chainId, library, account } = useActiveWeb3React()
  const { address } = useENS(account)

  return <TradeStake chainId={chainId} provider={library} address={address} account={account} />
}
