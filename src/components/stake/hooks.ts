import { useQuery } from 'react-query'
import { utils } from 'ethers'
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
import { Web3Provider } from '@ethersproject/providers/lib/web3-provider'
import { getMFIStakingContract } from 'utils'

interface StakingDataProps {
  chainId?: ChainId | undefined
  provider?: Web3Provider | undefined
  address?: string | undefined
  account?: string | undefined
  period: number
}

interface CanWithdrawDataProps {
  chainId?: ChainId | undefined
  provider?: Web3Provider | undefined
  address?: string | undefined
  account?: string | undefined
}

export const useMFIAPR = ({ chainId, provider, address, period }: StakingDataProps) => {
  const contract = getMFIStaking(chainId, provider)

  const mfIStaking = useQuery('getMFIStaking', () => getMFIAPRPerWeight(contract, Number(period)))
  const accruedRewardRetrieved = useQuery('getAccruedReward', async () => {
    const reward = await accruedReward(contract, address)
    return reward ? Number(utils.formatEther(reward)).toFixed(6) : '0'
  })
  const stakedBalance = useQuery('getStakeBalance', () => getStakedBalance(contract, address))
  // TODO - the below throws "SyntaxError: Cannot convert 0.000000 to a BigInt" but I'm not sure why
  // const stakedBalance = useQuery('getStakeBalance', async () => {
  //   const staked = await getStakedBalance(contract, address)
  //   return staked ? Number(utils.formatEther(staked)).toFixed(6) : '0'
  // })
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

export const useCanWithdraw = ({ chainId, provider, address, account }: CanWithdrawDataProps) => {
  return useQuery('canWithdraw', async () => {
    if (!chainId || !provider || !address || !account) return false

    const signedContract = await getMFIStakingContract(chainId, provider, account)

    if (!signedContract) return false

    return canWithdraw(signedContract, address)
  })
}
