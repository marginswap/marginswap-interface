import React from 'react'

import { ChainId, TokenAmount } from '@marginswap/sdk'
import { Web3Provider } from '@ethersproject/providers/lib/web3-provider'

import Parameters from './Parameters'
import { CustomLightSpinner } from '../../theme'
import Circle from '../../assets/images/blue-loader.svg'

import { getAvailableWithdrawalTime } from './utils'
import { getPegCurrency } from '../../constants'

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

  if (mfIStaking.isError) console.error('Error ::', mfIStaking.error)

  return (
    <DetailsFooter>
      <div className={classes.parameters + ' ' + classes.fullWidthPair}>
        <Parameters
          title="Estimated APR"
          value={mfIStaking.isError ? 'Error!' : mfIStaking.data || 0}
          hint="The estimated yield APR that is paid out on your staked balances"
        />
        <Parameters
          title="Accrued reward"
          value={
            accruedRewardRetrieved.isError
              ? 'Error!'
              : `${new TokenAmount(
                  getPegCurrency(chainId),
                  accruedRewardRetrieved?.data?.toString() || '0'
                ).toSignificant(3)} MFI`
          }
          hint="The amount of MFI you have accrued by staking"
        />
        <Parameters
          title="Current staked Balance"
          value={
            stakedBalance.isError
              ? 'Error!'
              : `${new TokenAmount(getPegCurrency(chainId), stakedBalance?.data?.toString() || '0').toSignificant(
                  3
                )} MFI`
          }
          hint="The MFI balance you currently have staked"
        />
        <Parameters
          title="Available for withdrawal after"
          value={
            availableForWithdrawAfter.isError ? 'Error!' : getAvailableWithdrawalTime(availableForWithdrawAfter.data)
          }
          hint="The date after which your staked MFI will be available for withdrawal"
        />
      </div>
    </DetailsFooter>
  )
}

export default MFIData
