import React, { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
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
  Token
} from '@marginswap/sdk'

import { ApprovalState, useApproveCallbackFromStakeTrade } from '../../hooks/useApproveCallback'

import AppBody from '../../pages/AppBody'
import { TYPE } from '../../theme'
import { RowBetween } from '../Row'
import Select from '../Select'
import ToggleSelector from '../ToggleSelector'
import { GreyCard } from '../../components/Card'
import ApprovalStepper from './ApprovalStepper'

import { getMFIStakingContract } from 'utils'
import { getNotificationMsn } from './utils'
import { utils } from 'ethers'

import { DropdownsContainer, StyledOutlinedInput, StyledStakeHeader, StyledBalanceMax } from './styleds'
import { PaddedColumn, Wrapper } from '../swap/styleds'
import { Web3Provider } from '@ethersproject/providers/lib/web3-provider'
import { useCanWithdraw } from './hooks'

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
  chainId?: ChainId
  provider?: Web3Provider
  address: string
  account?: string
}

export default function TradeStake({ chainId, provider, address, account }: StakeProps) {
  const [mfiStake, setMfiStake] = useState(true)
  const [confirmStakeModal, setConfirmStakeModal] = useState(false)

  const { control, watch, setValue, register } = useForm()

  const amount: string = watch('amount', '0')
  const transactionType = watch('transactionType', 1)
  const period = watch('period', 1)

  const getMFIToken = new Token(chainId ?? ChainId.MAINNET, '0xAa4e3edb11AFa93c41db59842b29de64b72E355B', 18, 'MFI')
  const canWithdraw = useCanWithdraw({ chainId, provider, address, account })
  //TODO: REVIEW WITH GABRIEL: IF AMOUNT IS FLOAT TYPE, RETURNS AN ERROR -> CANNOT CONVERT TO BIGINT
  // check whether the user has approved the router on the input token
  const [approval, approveCallback] = useApproveCallbackFromStakeTrade(
    mfiStake,
    new TokenAmount(getMFIToken, utils.parseUnits(amount || '0', getMFIToken.decimals).toBigInt())
  )
  console.log('🚀 ~ file: Trade.tsx ~ line 51 ~ TradeStake ~ approval', approval)

  const approvalSubmitted = approval === ApprovalState.APPROVED || approval === ApprovalState.PENDING

  const handleMaxAmount = async () => {
    if (provider) {
      const balance = await getTokenBalance(address, getMFIToken.address, provider)
      console.log('BALANCE ::', utils.formatUnits(balance, getMFIToken.decimals))
      //TODO: REVIEW THE NUMBER().toFixed(0) TYPE WITH GABRIEL.
      setValue('amount', utils.formatUnits(balance, getMFIToken.decimals).toString())
    }
  }

  const handleStake = async () => {
    setConfirmStakeModal(true)
    /*const signedContract = getMFIStakingContract(chainId, provider, account)
    const tokenAmt = utils.parseUnits(amount, 18)

    if (signedContract) {
      if (transactionType.toString() === transactionTypeOptions[0].value) {
        stake(signedContract, tokenAmt.toHexString(), Duration.ONE_WEEK)
          .then((data: any) => {
            console.log('Stake ::', data)
            setValue('amount', '0')
          })
          .catch((err: any) => console.log('Upps error in stake :', err))
      }

      if (transactionType.toString() === transactionTypeOptions[1].value) {
        withdrawStake(signedContract, tokenAmt.toHexString())
          .then((data: any) => {
            console.log('Withdraw Stake ::', data)
            setValue('amount', '0')
          })
          .catch((err: any) => console.log('Upps error in withdrawStake :', err))
      }

      if (transactionType.toString() === transactionTypeOptions[2].value) {
        withdrawReward(signedContract)
          .then((data: any) => {
            console.log('Withdraw Reward ::', data)
            setValue('amount', '0')
          })
          .catch((err: any) => console.log('Upps error in withdrawReward :', err))
      }
    }*/
  }

  const handleDismissModal = () => {
    setConfirmStakeModal(false)
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

  return (
    <>
      <AppBody>
        <form>
          <StyledStakeHeader>
            <RowBetween>
              <TYPE.black fontWeight={500}>Stake</TYPE.black>
            </RowBetween>
          </StyledStakeHeader>
          <PaddedColumn>
            <ToggleSelector options={['MFI', 'LIQUIDITY TOKEN']} state={mfiStake} setState={setMfiStake} />
          </PaddedColumn>
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
            {isAbleTransaction ? (
              <ApprovalStepper
                firstStepLabel={transactionTypeOptions.find(tt => tt.value === transactionType)?.label || ''}
                firstStepOnClick={e => {
                  e.preventDefault()
                  approveCallback()
                }}
                secondStepLabel="Stake"
                secondStepOnClick={e => {
                  e.preventDefault()
                  handleStake()
                }}
                approval={approval}
                approvalSubmitted={approvalSubmitted}
              />
            ) : (
              <GreyCardStyled>{getNotificationMsn(isAbleTransaction, false)}</GreyCardStyled>
            )}
          </Wrapper>
        </form>
      </AppBody>
      {mfiStake ? (
        <MFIData chainId={chainId} provider={provider} address={address} period={period} />
      ) : (
        <LiquidityData chainId={chainId} provider={provider} address={address} period={period} />
      )}
      <ConfirmStakeModal
        token={getMFIToken}
        chainId={chainId}
        provider={provider}
        address={address}
        period={period}
        mfiStake={mfiStake}
        amount={amount}
        attemptingTxn={false}
        txHash=""
        onConfirm={() => null}
        onDismiss={handleDismissModal}
        isOpen={confirmStakeModal}
        stakeErrorMsn=""
      />
    </>
  )
}
