import React from 'react'

import { ChainId } from '@marginswap/sdk'
import { Web3Provider } from '@ethersproject/providers/lib/web3-provider'

import Skeleton from '@material-ui/lab/Skeleton'

import { getAvailableWithdrawalTime } from './utils'

import { DataContainer } from './styleds'
import { useMFIAPR } from './hooks'

interface StakingData {
  chainId?: ChainId
  provider?: Web3Provider
  address?: string
  period: number
}

const MFIData = ({ chainId, provider, address, period }: StakingData) => {
  const { mfIStaking, accruedRewardRetrieved, stakedBalance, availableForWithdrawAfter } = useMFIAPR({
    chainId,
    provider,
    address,
    period
  })

  return (
    <DataContainer>
      <span>
        Estimated APR: {mfIStaking.isLoading ? <Skeleton variant="text" /> : <strong>{`${mfIStaking.data}%`}</strong>}
      </span>
      <span>
        Accrued reward:{' '}
        {accruedRewardRetrieved.isLoading ? (
          <Skeleton variant="text" />
        ) : (
          <strong>{`${accruedRewardRetrieved.data} MFI`}</strong>
        )}
      </span>
      <span>
        Current staked balance:
        {stakedBalance.isLoading ? <Skeleton variant="text" /> : <strong>{`${stakedBalance.data} MFI`}</strong>}
      </span>

      <span>
        Available for withdrawal after:{' '}
        {availableForWithdrawAfter.isLoading ? (
          <Skeleton variant="text" />
        ) : (
          <strong>{getAvailableWithdrawalTime(availableForWithdrawAfter.data)}</strong>
        )}
      </span>
    </DataContainer>
  )
}

export default MFIData
