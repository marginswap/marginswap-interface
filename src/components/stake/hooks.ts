import { useQuery } from 'react-query'
import {
  ChainId,
  getMFIStaking,
  getMFIAPRPerWeight,
  accruedReward,
  getTimeUntilLockEnd,
  getStakedBalance,
  getLiquidityMiningReward,
  getLiquidityAPRPerWeight
} from '@marginswap/sdk'
import { Web3Provider } from '@ethersproject/providers/lib/web3-provider'

interface StakingDataProps {
  chainId?: ChainId | undefined
  provider?: Web3Provider | undefined
  address?: string | undefined
  period: number
}

export const useMFIAPR = ({ chainId, provider, address, period }: StakingDataProps) => {
  const contract = getMFIStaking(chainId, provider)

  const mfIStaking = useQuery('getMFIStaking', () => getMFIAPRPerWeight(contract, period))
  const accruedRewardRetrieved = useQuery('getAccruedReward', () => accruedReward(contract, address))
  const stakedBalance = useQuery('getStakeBalance', () => getStakedBalance(contract, address))
  const availableForWithdrawAfter = useQuery('getTimeUntilLockEnd', () => getTimeUntilLockEnd(contract, address))

  return { mfIStaking, accruedRewardRetrieved, stakedBalance, availableForWithdrawAfter }
}

export const useLiquidityAPR = ({ chainId, provider, address, period }: StakingDataProps) => {
  const contract = getLiquidityMiningReward(chainId, provider)

  const mfIStaking = useQuery('getMFIStaking', () => getLiquidityAPRPerWeight(contract, period, provider))
  const accruedRewardRetrieved = useQuery('getAccruedReward', () => accruedReward(contract, address))
  const stakedBalance = useQuery('getStakeBalance', () => getStakedBalance(contract, address))
  const availableForWithdrawAfter = useQuery('getTimeUntilLockEnd', () => getTimeUntilLockEnd(contract, address))

  return { mfIStaking, accruedRewardRetrieved, stakedBalance, availableForWithdrawAfter }
}
