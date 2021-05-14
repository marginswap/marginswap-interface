import React, { useState, ChangeEvent, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useCurrency, useDefaultTokens, useAllTokens } from '../../hooks/Tokens'
import { useCurrencyBalance } from '../../state/wallet/hooks'
import Input from '@material-ui/core/Input'

import {
  getMFIStaking,
  getLiquidityMiningReward,
  getMFIAPRPerWeight,
  getLiquidityAPRPerWeight,
  canWithdraw,
  accruedReward,
  ChainId,
  getTimeUntilLockEnd,
  withdrawReward,
  withdrawStake,
  TokenAmount
} from '@marginswap/sdk'

import {
  useDefaultsFromURLSearch,
  useDerivedSwapInfo,
  useSwapActionHandlers,
  useSwapState
} from '../../state/swap/hooks'

import AppBody from '../../pages/AppBody'
import { TYPE, StyledButton } from '../../theme'
import { RowBetween } from '../Row'
import { ButtonPrimary } from '../Button'
import Select from '../Select'
import ToggleSelector from '../ToggleSelector'
import { Field } from '../../state/swap/actions'

import { DropdownsContainer, DataContainer, StyledOutlinedInput, StyledStakeHeader } from './styleds'
import { PaddedColumn, BottomGrouping, Wrapper } from '../swap/styleds'
import { Web3Provider } from '@ethersproject/providers/lib/web3-provider'

type StakeProps = {
  chainId?: ChainId
  provider?: Web3Provider
  address: string
  account?: string
}
const Trade = ({ chainId, provider, address, account }: StakeProps) => {
  const [mfiStake, setMfiStake] = useState(true)
  const [withdrawRewardValue, setWithdrawRewardValue] = useState(0)
  const [withdrawStakeValue, setWithdrawStakeValue] = useState(0)
  const [estimatedAPR, setEstimatedAPR] = useState(0)
  const [currentStakedBalance, setCurrentStakedBalance] = useState(0)
  const [availableForWithdrawAfter, setAvailableForWithdrawAfter] = useState(undefined)

  const { handleSubmit, control, watch, setValue } = useForm()
  const allTokens = useAllTokens()
  const getMFIToken = allTokens['0xAa4e3edb11AFa93c41db59842b29de64b72E355B']
  const balance = useCurrencyBalance(account ?? undefined, getMFIToken)
  console.log('🚀 ~ file: Trade.tsx ~ line 54 ~ Trade ~ balance', balance?.toSignificant(4))

  const {
    onSwitchTokens,
    onCurrencySelection,
    onUserInput,
    onChangeRecipient,
    onSwitchLeverageType
  } = useSwapActionHandlers()

  const amount = watch('amount', false)
  const transactionType = watch('transactionType', 'Deposit')
  let contract: any

  console.log(`chainId: ${chainId}, provider: ${provider}, MFIStake: ${mfiStake}`)

  if (chainId && provider) {
    if (mfiStake) {
      contract = getMFIStaking(chainId, provider)
      getMFIAPRPerWeight(contract, provider)
        .then((aprData: any) => setEstimatedAPR(aprData))
        .catch((e: any) => {
          console.log('APR ERROR MESSAGE :::', e.message)
        })
    } else {
      contract = getLiquidityMiningReward(chainId, provider)
      getLiquidityAPRPerWeight(contract, provider)
        .then((liquityData: any) => setEstimatedAPR(liquityData))
        .catch((e: any) => {
          console.log('LIQUITY ERROR MESSAGE :::', e.message)
        })
    }

    if (contract && address) {
      accruedReward(contract, address)
        .then((accruedReward: any) => {
          setCurrentStakedBalance(accruedReward.toNumber())
        })
        .catch((e: any) => {
          console.log('ACCRUED REWARD ERROR MESSAGE :::', e.message)
        })

      getTimeUntilLockEnd(contract, address)
        .then((withDrawAfter: any) => {
          setAvailableForWithdrawAfter(withDrawAfter)
        })
        .catch((e: any) => {
          console.log('ACCRUED REWARD ERROR MESSAGE :::', e.message)
        })

      canWithdraw(contract, address)
        .then((canWithdrawData: any) => console.log({ canWithdrawData }))
        .catch((e: any) => {
          console.log('CAN WITHDRAW ERROR MESSAGE :::', e.message)
        })

      withdrawReward(contract)
        .then((wdr: any) => console.log({ wdr }))
        .catch((e: any) => {
          console.log('WITHDRAW REWARD ERROR MESSAGE :::', e.message)
        })

      withdrawStake(contract, new TokenAmount(getMFIToken, '1000'))
        .then((ws: any) => console.log({ ws }))
        .catch((e: any) => {
          console.log('WITHDRAW STAKE ERROR MESSAGE :::', e.message)
        })
    }
  }

  const handleMaxAmount = () => {
    setValue('amount', balance?.toSignificant(4).toString())
  }

  const onSubmit = (data: any) => console.log(data)
  /*stake(contract, stakeAmount, ONE_WEEK)
      .then((data: any) => console.log('STAKE RESULT ::', data))
      .catch((e: any) => {
        console.log('STAKE ACTION ERROR MESSAGE :::', e.message)
      })*/

  const isAbleTransaction = !Boolean(amount?.length)

  return (
    <AppBody>
      <form onSubmit={handleSubmit(onSubmit)}>
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
            <Controller
              name="transactionType"
              defaultValue="Deposit"
              control={control}
              render={({ field }) => <Select options={['Deposit', 'Claim', 'Withdraw']} {...field} />}
            />
            <Controller
              name="period"
              defaultValue="One week"
              control={control}
              render={({ field }) => <Select options={['One week', 'One month', 'Three months']} {...field} />}
            />
          </DropdownsContainer>
          <DataContainer>
            <span>
              Estimated APR: <strong>{`${estimatedAPR}%`}</strong>
            </span>
            <span>
              Accrued reward: <strong>{`${currentStakedBalance} ${mfiStake ? 'MFI' : 'LIQUITY'}`}</strong>
            </span>
            <span></span>
            <span>
              Current staked balance: <strong>{`${currentStakedBalance} ${mfiStake ? 'MFI' : 'LIQUITY'}`}</strong>
            </span>

            <span>
              Available for withdrawal after: <strong>{availableForWithdrawAfter}</strong>
            </span>
          </DataContainer>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ position: 'relative', width: '100%' }}>
              <Controller
                name="amount"
                control={control}
                render={({ field }) => (
                  <StyledOutlinedInput
                    {...field}
                    type="number"
                    endAdornment={
                      <StyledButton
                        color="primary"
                        style={{
                          maxWidth: 20
                        }}
                        onClick={handleMaxAmount}
                      >
                        MAX
                      </StyledButton>
                    }
                  />
                )}
              />
            </div>
          </div>
          <ButtonPrimary type="submit" disabled={isAbleTransaction}>
            {isAbleTransaction ? 'Enter Amount' : transactionType}
          </ButtonPrimary>
        </Wrapper>
      </form>
    </AppBody>
  )
}
console.log('🚀 ~ file: Trade.tsx ~ line 194 ~ Trade ~ useDefaultTokens', useDefaultTokens)
console.log('🚀 ~ file: Trade.tsx ~ line 194 ~ Trade ~ useDefaultTokens', useDefaultTokens)
console.log('🚀 ~ file: Trade.tsx ~ line 194 ~ Trade ~ useDefaultTokens', useDefaultTokens)

export default Trade
