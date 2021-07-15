import React from 'react'

import { ChainId, TokenAmount, Token } from '@marginswap/sdk'
import { Web3Provider } from '@ethersproject/providers/lib/web3-provider'

import Parameters from './Parameters'
import { CustomLightSpinner } from '../../theme'
import Circle from '../../assets/images/blue-loader.svg'

import { getAvailableWithdrawalTime } from './utils'
import { MFI_ADDRESS } from '../../constants'

import { useStyles, DetailsFooter, LoadingDataContainer } from './styleds'
import { useMFIAPR } from './hooks'
interface StakingData {
  chainId?: ChainId | undefined
  provider?: Web3Provider | undefined
  address?: string | undefined
  pendingTxhHash?: string | null | undefined
}

const MFIData = ({ chainId, provider, address, pendingTxhHash }: StakingData) => {
  const classes = useStyles()
  const { mfIStaking, accruedRewardRetrieved, stakedBalance, availableForWithdrawAfter } = useMFIAPR({
    chainId,
    provider,
    address
  })

  if (
    mfIStaking.isLoading ||
    accruedRewardRetrieved.isLoading ||
    stakedBalance.isLoading ||
    availableForWithdrawAfter.isLoading ||
    pendingTxhHash
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
          value={`${mfIStaking.isError ? '0' : mfIStaking.data || 0}%`}
          hint="The estimated yield APR that is paid out on your staked balance"
        />
        <Parameters
          title="Accrued reward"
          value={
            accruedRewardRetrieved.isError
              ? 'Error!'
              : `${new TokenAmount(
                  new Token(chainId ?? 1, MFI_ADDRESS, 18),
                  accruedRewardRetrieved?.data?.toString() || '0'
                ).toSignificant(5)} MFI`
          }
          hint="The amount of MFI you have accrued by staking, including from legacy contracts. To withdraw it, select 'Claim' and then click 'Max' (which will not include legacy balance)"
        />
        <Parameters
          title="Current staked Balance"
          value={
            stakedBalance.isError
              ? 'Error!'
              : `${new TokenAmount(
                  new Token(chainId ?? 1, MFI_ADDRESS, 18),
                  stakedBalance?.data?.toString() || '0'
                ).toSignificant(7)} MFI`
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
