import { useQuery } from 'react-query'
import {
  ChainId,
  getLegacyStaking,
  getMFIStaking,
  getMFIAPRPerWeight,
  accruedReward,
  getTimeUntilLockEnd,
  getStakedBalance,
  getLiquidityMiningReward,
  getLiquidityAPRPerWeight,
  canWithdraw,
  isMigrated
} from '@marginswap/sdk'
import { Contract } from '@ethersproject/contracts'
import { Web3Provider } from '@ethersproject/providers/lib/web3-provider'
import { getMFIStakingContract } from 'utils'
import { useEffect, useState } from 'react'

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
  signedContract: Contract | undefined
}

interface SignedContractDataProps {
  chainId?: ChainId | undefined
  provider?: Web3Provider | undefined
  address?: string | undefined | null
  account?: string | undefined | null
  mfiStake: boolean
}

export const useMFIAPR = ({ chainId, provider, address }: StakingDataProps) => {
  const contract = getMFIStaking(chainId, provider)
  const legacyContract = getLegacyStaking(chainId, provider)

  const mfIStaking = useQuery('getMFIStaking', () => getMFIAPRPerWeight(contract))
  const accruedRewardRetrieved = useQuery('getAccruedMFIReward', () => accruedReward(contract, legacyContract, address))
  const stakedBalance = useQuery('getMFIStakeBalance', () => getStakedBalance(contract, address))
  const availableForWithdrawAfter = useQuery('getMFITimeUntilLockEnd', () => getTimeUntilLockEnd(contract, address))

  return { mfIStaking, accruedRewardRetrieved, stakedBalance, availableForWithdrawAfter }
}

export const useLiquidityAPR = ({ chainId, provider, address }: StakingDataProps) => {
  const contract = getLiquidityMiningReward(chainId, provider)

  const liquidityStaking = useQuery('getLiquidityStaking', () => getLiquidityAPRPerWeight(contract, provider))
  const accruedRewardRetrieved = useQuery('getLiquidityAccruedReward', () =>
    accruedReward(contract, undefined, address)
  )
  const stakedBalance = useQuery('getLiquidityStakeBalance', () => getStakedBalance(contract, address))
  const availableForWithdrawAfter = useQuery('getLiquidityTimeUntilLockEnd', () =>
    getTimeUntilLockEnd(contract, address)
  )

  return { liquidityStaking, accruedRewardRetrieved, stakedBalance, availableForWithdrawAfter }
}

export const useSignedContract = ({ chainId, provider, account, mfiStake }: SignedContractDataProps) => {
  const [contract, setContract] = useState<Contract>()
  useEffect(() => {
    const getSignedContract = async (chainId: ChainId, provider: Web3Provider, account: string) => {
      let signedContract: Contract | undefined
      if (mfiStake) signedContract = await getMFIStakingContract(chainId, provider, account)
      if (!mfiStake) signedContract = await getLiquidityMiningReward(chainId, provider)
      setContract(signedContract)
    }

    if (chainId && provider && account) {
      getSignedContract(chainId, provider, account)
    }
  }, [chainId, provider, account, mfiStake])

  return contract
}

export const useCanWithdraw = ({ address, signedContract }: CanWithdrawDataProps) => {
  const [canWithdrawData, setCanWithdrawData] = useState(false)

  useEffect(() => {
    const canWithdrawAmount = async (address: string, signedContract: Contract) => {
      const canDoIt = await canWithdraw(signedContract, address)
      setCanWithdrawData(canDoIt)
    }

    if (address && signedContract) {
      canWithdrawAmount(address, signedContract)
    }
  }, [address, signedContract])

  return canWithdrawData
}

export const useIsMigrated = ({ chainId, provider, account, signedContract }: CanWithdrawDataProps) => {
  const [migrate, setMigrate] = useState(false)
  useEffect(() => {
    const callIsMigrate = async (
      signedContract: Contract,
      chainId: ChainId,
      provider: Web3Provider,
      account: string
    ) => {
      const migrateStatus = await isMigrated(signedContract, chainId, provider, account)
      setMigrate(migrateStatus)
    }

    if (chainId && provider && account && signedContract) {
      callIsMigrate(signedContract, chainId, provider, account)
    }
  }, [chainId, provider, account, signedContract])

  return migrate
}
