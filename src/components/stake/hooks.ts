import { useQuery } from 'react-query'
import {
  ChainId,
  getMFIStaking,
  getMFIAPRPerWeight,
  accruedReward,
  getTimeUntilLockEnd,
  getStakedBalance,
  getLiquidityMiningReward,
  getLiquidityAPRPerWeight,
  canWithdraw
} from '@marginswap/sdk'
import { Contract } from '@ethersproject/contracts'
import { Web3Provider } from '@ethersproject/providers/lib/web3-provider'
import { getMFIStakingContract } from 'utils'

interface StakingDataProps {
  chainId?: ChainId | undefined
  provider?: Web3Provider | undefined
  address?: string | undefined
  account?: string | undefined | null
}

interface CanWithdrawDataProps {
  chainId?: ChainId | undefined
  provider?: Web3Provider | undefined
  address?: string | undefined | null
  account?: string | undefined | null
  mfiStake: boolean
}

export const useMFIAPR = ({ chainId, provider, address }: StakingDataProps) => {
  const contract = getMFIStaking(chainId, provider)

  const mfIStaking = useQuery('getMFIStaking', () => getMFIAPRPerWeight(contract))
  const accruedRewardRetrieved = useQuery('getAccruedMFIReward', () => accruedReward(contract, address))
  const stakedBalance = useQuery('getMFIStakeBalance', () => getStakedBalance(contract, address))
  const availableForWithdrawAfter = useQuery('getMFITimeUntilLockEnd', () => getTimeUntilLockEnd(contract, address))

  return { mfIStaking, accruedRewardRetrieved, stakedBalance, availableForWithdrawAfter }
}

export const useLiquidityAPR = ({ chainId, provider, address }: StakingDataProps) => {
  const contract = getLiquidityMiningReward(chainId, provider)

  const liquidityStaking = useQuery('getLiquidityStaking', () => getLiquidityAPRPerWeight(contract, provider))
  const accruedRewardRetrieved = useQuery('getLiquidityAccruedReward', () => accruedReward(contract, address))
  const stakedBalance = useQuery('getLiquidityStakeBalance', () => getStakedBalance(contract, address))
  const availableForWithdrawAfter = useQuery('getLiquidityTimeUntilLockEnd', () =>
    getTimeUntilLockEnd(contract, address)
  )

  return { liquidityStaking, accruedRewardRetrieved, stakedBalance, availableForWithdrawAfter }
}

export const useCanWithdraw = ({ chainId, provider, address, account, mfiStake }: CanWithdrawDataProps) => {
  return useQuery('canWithdraw', async () => {
    if (!chainId || !provider || !address || !account) return false

    let signedContract: Contract | undefined

    if (mfiStake) signedContract = await getMFIStakingContract(chainId, provider, account)

    if (!mfiStake) signedContract = await getLiquidityMiningReward(chainId, provider)

    if (!signedContract) return false

    return canWithdraw(signedContract, address)
  })
}
