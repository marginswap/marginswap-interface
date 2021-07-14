import React, { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useQueryClient } from 'react-query'
import styled from 'styled-components'

import MFIData from './MFIData'
import LiquidityData from './LiquidityData'
import ConfirmStakeModal from './ConfirmStakeModal'

import {
  ChainId,
  TokenAmount,
  stake,
  withdrawStake,
  exitLegacyStake,
  withdrawReward,
  getTokenBalance,
  Token,
  accruedReward,
  getStakedBalance,
  getMFIStaking,
  getLiquidityMiningReward
} from '@marginswap/sdk'

import { ApprovalState, useApproveCallbackFromStakeTrade } from '../../hooks/useApproveCallback'
import { useIsTransactionPending, useTransactionAdder } from '../../state/transactions/hooks'

import AppBody from '../../pages/AppBody'
import { TYPE } from '../../theme'
import { RowBetween } from '../Row'
import Select from '../Select'
// import ToggleSelector from '../ToggleSelector'
import { GreyCard } from '../../components/Card'
import ApprovalStepper from './ApprovalStepper'
import MigrateStepper from './MigrateStepper'
import { WarningBar } from '../../components/Placeholders'

import { getLegacyStakingContract } from 'utils'
import { getNotificationMsn } from './utils'
import { utils } from 'ethers'

import { DropdownsContainer, StyledOutlinedInput, StyledStakeHeader, StyledBalanceMax } from './styleds'
import { /*PaddedColumn,*/ Wrapper } from '../swap/styleds'
import { Web3Provider } from '@ethersproject/providers/lib/web3-provider'
import { useCanWithdraw, useIsMigrated, useSignedContract } from './hooks'
import { MFI_ADDRESS, MFI_USDC_ADDRESS } from '../../constants'
import { TransactionDetails } from '../../state/transactions/reducer'

const GreyCardStyled = styled(GreyCard)`
  background-color: ${({ theme }) => theme.bg3};
  color: ${({ theme }) => theme.text3};
  cursor: auto;
  box-shadow: none;
  border: 1px solid transparent;
  outline: none;
  opacity: 1;
  font-size: 20px;
  text-align: center;
`

interface StakeProps {
  chainId?: ChainId | undefined
  provider?: Web3Provider | undefined
  address?: string | undefined | null
  account?: string | undefined | null
}

export default function TradeStake({ chainId, provider, address, account }: StakeProps) {
  const [mfiStake /*, setMfiStake*/] = useState(true)
  const [attemptingTxn, setAttemptingTxn] = useState(false)
  const [confirmStakeModal, setConfirmStakeModal] = useState(false)
  const [stakeErrorMsn, setStakeErrorMsn] = useState('')
  const [txHash, setTxHash] = useState('')
  const [pendingTxhHash, setPendingTxhHash] = useState<string | null>()

  const { control, watch, setValue, register } = useForm()
  const queryClient = useQueryClient()

  const amount: string = watch('amount', '0')
  const transactionType = watch('transactionType', 1)
  const addTransactionResponseCallback = (responseObject: TransactionDetails) => {
    setPendingTxhHash(responseObject.hash)
  }

  const getMFIToken = new Token(chainId ?? ChainId.MAINNET, MFI_ADDRESS, 18, 'MFI')
  const getLiquidityToken = new Token(chainId ?? ChainId.MAINNET, MFI_USDC_ADDRESS, 18, 'MFI/USDC')
  const currentToken = mfiStake ? getMFIToken : getLiquidityToken
  const signedContract = useSignedContract({ chainId, provider, account, mfiStake })
  const canWithdraw = useCanWithdraw({
    chainId,
    provider,
    address,
    account,
    signedContract
  })
  const isMigrated = useIsMigrated({
    chainId,
    provider,
    address,
    account,
    signedContract
  })
  const addTransaction = useTransactionAdder(addTransactionResponseCallback)
  const isTxnPending = useIsTransactionPending(pendingTxhHash || '')
  // check whether the user has approved the router on the input token
  const [approval, approveCallback] = useApproveCallbackFromStakeTrade(
    mfiStake,
    new TokenAmount(currentToken, utils.parseUnits(amount || '0', currentToken.decimals).toBigInt())
  )

  const approvalSubmitted = approval === ApprovalState.APPROVED || approval === ApprovalState.PENDING
  const migrated = isMigrated && transactionType === '3'

  useEffect(() => {
    if (!isTxnPending && pendingTxhHash) {
      setPendingTxhHash(null)
      queryClient.refetchQueries()
    }
  }, [isTxnPending])

  const handleMaxAmount = async () => {
    if (provider) {
      let contract

      if (mfiStake) {
        contract = getMFIStaking(chainId, provider)
      } else {
        contract = getLiquidityMiningReward(chainId, provider)
      }

      const txnType = transactionType.toString()
      let balance

      // Deposit
      if (txnType === transactionTypeOptions[0].value) {
        if (mfiStake && address) {
          balance = await getTokenBalance(address, getMFIToken.address, provider)
        } else {
          if (address) {
            balance = await getTokenBalance(address, getLiquidityToken.address, provider)
          }
        }
      }

      // Claim
      if (txnType === transactionTypeOptions[1].value && address) {
        balance = await accruedReward(contract, undefined, address)
      }

      // Withdraw
      if (txnType === transactionTypeOptions[2].value && address) {
        balance = await getStakedBalance(contract, address)
      }

      setValue('amount', balance ? utils.formatEther(balance) : '0')
    }
  }

  const handleError = (error: string) => {
    setAttemptingTxn(false)
    setTxHash('')
    setStakeErrorMsn('')
    setStakeErrorMsn(error)
  }

  const handleMigrate = async () => {
    const legacy = await getLegacyStakingContract(chainId, provider, account ?? undefined)

    if (legacy && account) {
      exitLegacyStake(legacy, account)
        .then((data: any) => {
          addTransaction(data, {
            summary: `Migrate stake`
          })
          setAttemptingTxn(false)
          setTxHash(data.hash)
        })
        .catch((err: any) => {
          console.error(err)
          handleError(err?.data?.message)
        })
    } else {
      console.log('Error with legacy contract')
    }
  }

  const handleStake = async () => {
    const tokenAmt = utils.parseUnits(amount, 18)

    if (signedContract) {
      setAttemptingTxn(true)
      if (transactionType.toString() === transactionTypeOptions[0].value) {
        stake(signedContract, tokenAmt.toHexString())
          .then((data: any) => {
            addTransaction(data, {
              summary: `Deposit Stake`
            })
            setAttemptingTxn(false)
            setTxHash(data.hash)
            setValue('amount', '0')
          })
          .catch((err: any) => handleError(err?.data?.message))
      }

      if (transactionType.toString() === transactionTypeOptions[1].value) {
        withdrawReward(signedContract)
          .then((data: any) => {
            addTransaction(data, {
              summary: `Claim Stake`
            })
            setAttemptingTxn(false)
            setTxHash(data.hash)
            setValue('amount', '0')
          })
          .catch((err: any) => handleError(err.data.message))
      }

      if (transactionType.toString() === transactionTypeOptions[2].value) {
        withdrawStake(signedContract, tokenAmt.toHexString())
          .then((data: any) => {
            addTransaction(data, {
              summary: `Withdraw Stake`
            })
            setAttemptingTxn(false)
            setTxHash(data.hash)
            setValue('amount', '0')
          })
          .catch((err: any) => handleError(err?.data?.message))
      }
    }
  }

  const handleDismissModal = () => {
    setConfirmStakeModal(false)
    setAttemptingTxn(false)
    setTxHash('')
    setStakeErrorMsn('')
    queryClient.refetchQueries()
  }

  const transactionTypeOptions = [
    { value: '1', label: 'Deposit' },
    { value: '2', label: 'Claim' },
    { value: '3', label: 'Withdraw' }
  ]

  const isAbleTransaction = Boolean(amount?.length) && Number(amount) > 0
  const isAbleToWithdraw = transactionType === '1' || (canWithdraw && transactionType !== '1')

  return (
    <div style={{ maxWidth: 420 }}>
      {!account && <WarningBar>Wallet not connected</WarningBar>}
      <AppBody>
        <form>
          <StyledStakeHeader>
            <RowBetween>
              <TYPE.black fontWeight={500}>Stake</TYPE.black>
            </RowBetween>
          </StyledStakeHeader>
          {/* <PaddedColumn>
            <ToggleSelector options={['MFI', 'LIQUIDITY TOKEN']} state={mfiStake} setState={setMfiStake} />
          </PaddedColumn> */}
          <Wrapper>
            <DropdownsContainer>
              <Select name="transactionType" options={transactionTypeOptions} register={register} />
            </DropdownsContainer>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ position: 'relative', width: '100%' }}>
                <Controller
                  name="amount"
                  defaultValue=""
                  control={control}
                  render={({ field }) => (
                    <StyledOutlinedInput
                      {...field}
                      disabled={!account}
                      type="number"
                      endAdornment={
                        <StyledBalanceMax
                          onClick={e => {
                            e.preventDefault()
                            handleMaxAmount()
                          }}
                        >
                          MAX
                        </StyledBalanceMax>
                      }
                    />
                  )}
                />
              </div>
            </div>
            {!migrated && isAbleTransaction && isAbleToWithdraw ? (
              <ApprovalStepper
                firstStepLabel={transactionTypeOptions.find(tt => tt.value === transactionType)?.label || ''}
                firstStepOnClick={e => {
                  e.preventDefault()
                  approveCallback()
                }}
                secondStepLabel={transactionTypeOptions.find(tt => tt.value === transactionType)?.label || ''}
                secondStepOnClick={e => {
                  e.preventDefault()
                  setConfirmStakeModal(true)
                }}
                approval={approval}
                approvalSubmitted={approvalSubmitted}
              />
            ) : migrated && isAbleToWithdraw ? (
              <MigrateStepper
                firstStepOnClick={e => {
                  e.preventDefault()
                  handleMigrate()
                }}
                secondStepLabel={transactionTypeOptions.find(tt => tt.value === transactionType)?.label || ''}
                secondStepOnClick={e => {
                  e.preventDefault()
                  setConfirmStakeModal(true)
                }}
                migrated={migrated}
              />
            ) : (
              <GreyCardStyled>{getNotificationMsn(isAbleTransaction, canWithdraw || false, false)}</GreyCardStyled>
            )}
          </Wrapper>
        </form>
      </AppBody>
      {mfiStake ? (
        <MFIData chainId={chainId} provider={provider} address={address ?? undefined} pendingTxhHash={pendingTxhHash} />
      ) : (
        <LiquidityData
          chainId={chainId}
          provider={provider}
          address={address ?? undefined}
          pendingTxhHash={pendingTxhHash}
        />
      )}
      <WarningBar>
        To support continuous staking, all stake will be locked for 30 days, after which it can be withdrawn. If you
        previously staked in the system that supported multiple stake durations, you will have to migrate your stake
        after your staking period ends, in order to withdraw it. When you migrate your stake will not be locked up
        again, you can withdraw immediately if you like. Accrued reward balance for migrated 90 day stakers includes a
        pre-applied bonus to make up for longer staking period.
      </WarningBar>
      <ConfirmStakeModal
        token={currentToken}
        chainId={chainId}
        provider={provider}
        address={address ?? undefined}
        mfiStake={mfiStake}
        amount={amount}
        attemptingTxn={attemptingTxn}
        txHash={txHash}
        onConfirm={handleStake}
        onDismiss={handleDismissModal}
        isOpen={confirmStakeModal}
        stakeErrorMsn={stakeErrorMsn}
      />
    </div>
  )
}
