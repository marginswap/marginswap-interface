import React from 'react'

import { ChainId, TokenAmount } from '@marginswap/sdk'
import { Web3Provider } from '@ethersproject/providers/lib/web3-provider'

import Parameters from './Parameters'
import { CustomLightSpinner } from '../../theme'
import Circle from '../../assets/images/blue-loader.svg'
import { useStyles, DetailsFooter, LoadingDataContainer } from './styleds'

import { getAvailableWithdrawalTime } from './utils'
import { getPegCurrency } from '../../constants'

import { useLiquidityAPR } from './hooks'

interface StakingData {
  chainId?: ChainId | undefined
  provider?: Web3Provider | undefined
  address?: string | undefined
  period: number
}

const LiquidityData = ({ chainId, provider, address, period }: StakingData) => {
  const classes = useStyles()
  const { liquidityStaking, accruedRewardRetrieved, stakedBalance, availableForWithdrawAfter } = useLiquidityAPR({
    chainId,
    provider,
    address,
    period
  })

  if (
    liquidityStaking.isLoading ||
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

  if (liquidityStaking.isError) console.error('Error ::', liquidityStaking.error)

  return (
    <DetailsFooter>
      <div className={classes.parameters + ' ' + classes.fullWidthPair}>
        <Parameters
          title="Estimated APR"
          value={liquidityStaking.isError ? 'Error!' : liquidityStaking.data || 0}
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
                ).toSignificant(3)} Liquidity`
          }
          hint="The amount of liquidity token you have accrued by staking"
        />
        <Parameters
          title="Current staked Balance"
          value={
            stakedBalance.isError
              ? 'Error!'
              : `${new TokenAmount(getPegCurrency(chainId), stakedBalance?.data?.toString() || '0').toSignificant(
                  3
                )} Liquidity`
          }
          hint="The liquidity token balance you currently have staked"
        />
        <Parameters
          title="Available for withdrawal after"
          value={
            availableForWithdrawAfter.isError ? 'Error!' : getAvailableWithdrawalTime(availableForWithdrawAfter.data)
          }
          hint="The date after which your staked liquidity token will be available for withdrawal"
        />
      </div>
    </DetailsFooter>
  )
}

export default LiquidityData
