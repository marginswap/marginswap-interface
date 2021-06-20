import React from 'react'

import { ChainId } from '@marginswap/sdk'
import { Web3Provider } from '@ethersproject/providers/lib/web3-provider'

import Parameters from './Parameters'
import { CustomLightSpinner } from '../../theme'
import Circle from '../../assets/images/blue-loader.svg'

import { getAvailableWithdrawalTime } from './utils'

import { useStyles, DetailsFooter, LoadingDataContainer } from './styleds'
import { useMFIAPR } from './hooks'
interface StakingData {
  chainId?: ChainId | undefined
  provider?: Web3Provider | undefined
  address?: string | undefined
  period: number
}

const MFIData = ({ chainId, provider, address, period }: StakingData) => {
  const classes = useStyles()
  const { mfIStaking, accruedRewardRetrieved, stakedBalance, availableForWithdrawAfter } = useMFIAPR({
    chainId,
    provider,
    address,
    period
  })

  if (
    mfIStaking.isLoading ||
    accruedRewardRetrieved.isLoading ||
    stakedBalance.isLoading ||
    availableForWithdrawAfter.isLoading
  ) {
    return (
      <LoadingDataContainer>
        <CustomLightSpinner src={Circle} alt="loader" size={'25px'} />
      </LoadingDataContainer>
    )
  }

  if (mfIStaking.isError) console.log('Error ::', mfIStaking.error)

  return (
    <DetailsFooter>
      <div className={classes.parameters + ' ' + classes.fullWidthPair}>
        <Parameters
          title="Estimated APR"
          value={mfIStaking.isError ? 'Error!' : mfIStaking.data || 0}
          hint="Your transaction will revert if there is a large, unfavorable price movement before it is confirmed"
        />
        <Parameters
          title="Accrued reward"
          value={accruedRewardRetrieved.isError ? 'Error!' : `${accruedRewardRetrieved.data} MFI`}
          hint="The difference between the market price and estimated price due to trade size"
        />
        <Parameters
          title="Current staked Balance"
          value={stakedBalance.isError ? 'Error!' : `${stakedBalance.data} MFI`}
          hint={`A portion of each trade XXX goes to liquidity providers as a protocol incentive`}
        />
        <Parameters
          title="Available for withdrawal after"
          value={
            availableForWithdrawAfter.isError ? 'Error!' : getAvailableWithdrawalTime(availableForWithdrawAfter.data)
          }
          hint="Mock stuff!"
        />
      </div>
    </DetailsFooter>
  )
}

export default MFIData
