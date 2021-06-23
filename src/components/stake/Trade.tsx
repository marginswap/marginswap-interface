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
  withdrawReward,
  Duration,
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
import { WarningBar } from '../../components/Placeholders'

import { getMFIStakingContract, getLiquidityStakingContract } from 'utils'
import { getNotificationMsn } from './utils'
import { utils } from 'ethers'

import { DropdownsContainer, StyledOutlinedInput, StyledStakeHeader, StyledBalanceMax } from './styleds'
import { /*PaddedColumn,*/ Wrapper } from '../swap/styleds'
import { Web3Provider } from '@ethersproject/providers/lib/web3-provider'
import { useCanWithdraw } from './hooks'
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
  const period = watch('period', 1)
  const addTransactionResponseCallback = (responseObject: TransactionDetails) => {
    setPendingTxhHash(responseObject.hash)
  }

  const getMFIToken = new Token(chainId ?? ChainId.MAINNET, MFI_ADDRESS, 18, 'MFI')
  const getLiquidityToken = new Token(chainId ?? ChainId.MAINNET, MFI_USDC_ADDRESS, 18, 'MFI/USDC')
  const currentToken = mfiStake ? getMFIToken : getLiquidityToken
  const canWithdraw = useCanWithdraw({ chainId, provider, address, account, mfiStake })
  const addTransaction = useTransactionAdder(addTransactionResponseCallback)
  const isTxnPending = useIsTransactionPending(pendingTxhHash || '')
  // check whether the user has approved the router on the input token
  const [approval, approveCallback] = useApproveCallbackFromStakeTrade(
    mfiStake,
    new TokenAmount(currentToken, utils.parseUnits(amount || '0', currentToken.decimals).toBigInt())
  )

  const approvalSubmitted = approval === ApprovalState.APPROVED || approval === ApprovalState.PENDING

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
        balance = await accruedReward(contract, address)
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

  const getDuration = () => {
    switch (period) {
      case periodSelectOptions[0].value:
        return Duration.ONE_WEEK
      case periodSelectOptions[1].value:
        return Duration.ONE_MONTH
      case periodSelectOptions[2].value:
        return Duration.THREE_MONTHS
      default:
        return Duration.ONE_WEEK
    }
  }

  const handleStake = async () => {
    let signedContract

    if (mfiStake && account) {
      signedContract = getMFIStakingContract(chainId, provider, account)
    } else {
      if (account) {
        signedContract = getLiquidityStakingContract(chainId, provider, account)
      }
    }

    const tokenAmt = utils.parseUnits(amount, 18)

    if (signedContract) {
      setAttemptingTxn(true)
      if (transactionType.toString() === transactionTypeOptions[0].value) {
        stake(signedContract, tokenAmt.toHexString(), getDuration())
          .then((data: any) => {
            addTransaction(data, {
              summary: `Deposit Stake`
            })
            setAttemptingTxn(false)
            setTxHash(data.hash)
            setValue('amount', '0')
          })
          .catch((err: any) => handleError(err.data.message))
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
          .catch((err: any) => handleError(err.data.message))
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

  const periodSelectOptions = [
    { value: '1', label: 'One week' },
    { value: '2', label: 'One month' },
    { value: '3', label: 'Three months' }
  ]

  const transactionTypeOptions = [
    { value: '1', label: 'Deposit' },
    { value: '2', label: 'Claim' },
    { value: '3', label: 'Withdraw' }
  ]

  const isAbleTransaction = Boolean(amount?.length) && Number(amount) > 0
  const isAbleToWithdraw = transactionType === '1' || (canWithdraw.data && transactionType !== '1')

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
              <Select name="period" options={periodSelectOptions} register={register} />
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
            {isAbleTransaction && isAbleToWithdraw ? (
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
            ) : (
              <GreyCardStyled>{getNotificationMsn(isAbleTransaction, canWithdraw.data || false, false)}</GreyCardStyled>
            )}
          </Wrapper>
        </form>
      </AppBody>
      {mfiStake ? (
        <MFIData
          chainId={chainId}
          provider={provider}
          address={address ?? undefined}
          period={Number(period)}
          pendingTxhHash={pendingTxhHash}
        />
      ) : (
        <LiquidityData
          chainId={chainId}
          provider={provider}
          address={address ?? undefined}
          period={Number(period)}
          pendingTxhHash={pendingTxhHash}
        />
      )}
      <ConfirmStakeModal
        token={currentToken}
        chainId={chainId}
        provider={provider}
        address={address ?? undefined}
        period={Number(period)}
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
