import React, { useState, ChangeEvent, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useCurrency, useDefaultTokens, useAllTokens, useIsUserAddedToken } from '../../hooks/Tokens'
import { useCurrencyBalance } from '../../state/wallet/hooks'

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
  TokenAmount,
  stake,
  getAccountHoldingTotal,
  BigintIsh,
  Duration
} from '@marginswap/sdk'

import {
  useDefaultsFromURLSearch,
  useDerivedSwapInfo,
  useSwapActionHandlers,
  useSwapState
} from '../../state/swap/hooks'
import { BigNumber } from '@ethersproject/bignumber'

import AppBody from '../../pages/AppBody'
import { TYPE, StyledButton } from '../../theme'
import { RowBetween } from '../Row'
import { ButtonPrimary } from '../Button'
import Select from '../Select'
import ToggleSelector from '../ToggleSelector'

import { getAPRPerPeriod } from './utils'
import { getMFIStakingContract } from '../../utils'

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
  const customAdded = useIsUserAddedToken(getMFIToken)
  const balance = useCurrencyBalance(account ?? undefined, getMFIToken)

  const {
    onSwitchTokens,
    onCurrencySelection,
    onUserInput,
    onChangeRecipient,
    onSwitchLeverageType
  } = useSwapActionHandlers()

  const amount = watch('amount', '')
  const transactionType = watch('transactionType', 'Deposit')
  const period = watch('period', 'One Week')
  let contract: any
  let contract2: any

  console.log(`CHAIN ID: ${chainId}, PROVIDER: ${provider}, MFI STAKE: ${mfiStake}`)
  console.log(`TRANSITON TYPE: ${transactionType} PERIOD: ${period}`)

  if (chainId && provider) {
    if (mfiStake) {
      contract = getMFIStaking(chainId, provider)
      getMFIAPRPerWeight(contract, provider)
        .then((aprData: any) => setEstimatedAPR(getAPRPerPeriod(aprData, period)))
        .catch((e: any) => {
          console.log('APR ERROR MESSAGE :::', e.message)
        })
    } else {
      contract = getLiquidityMiningReward(chainId, provider)
      getLiquidityAPRPerWeight(contract, provider)
        .then((liquityData: any) => setEstimatedAPR(getAPRPerPeriod(liquityData, period)))
        .catch((e: any) => {
          console.log('LIQUITY ERROR MESSAGE :::', e.message)
        })
    }

    if (contract && address) {
      if (account) {
        getAccountHoldingTotal(account, chainId, provider)
          .then((accHolding: any) => {
            console.log('account :::::::::::', accHolding.toString())
          })
          .catch((e: any) => {
            console.log('accHolding ERROR MESSAGE :::', e.message)
          })

        contract2 = getMFIStakingContract(chainId, provider, account)
        console.log('ACCOUNT ::', account)
        console.log('CONTRACT2 ::', contract2)

        /*withdrawReward(contract2)
          .then((wdr: any) => console.log({ wdr }))
          .catch((e: any) => {
            console.log('WITHDRAW REWARD ERROR MESSAGE :::', e.message)
          })

        withdrawStake(contract2, new TokenAmount(getMFIToken, '1000'))
          .then((ws: any) => console.log({ ws }))
          .catch((e: any) => {
            console.log('WITHDRAW STAKE ERROR MESSAGE :::', e.message)
          })*/
      }

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
    }
  }

  const handleMaxAmount = () => {
    console.log('BALANCE ::', balance?.toSignificant(4).toString())
    setValue('amount', balance?.toSignificant(4).toString())
  }

  const onSubmit = (data: any) => {
    console.log('here ::')
    let tokenAmt: TokenAmount
    try {
      tokenAmt = new TokenAmount(getMFIToken, amount)
      console.log('tokenAmt ::', tokenAmt)

      stake(contract2, tokenAmt, Duration.ONE_WEEK)
        .then((data: any) => console.log('STAKE RESULT ::', data))
        .catch((e: any) => {
          console.log('STAKE ACTION ERROR MESSAGE :::', e.message)
        })
    } catch (error: any) {
      console.log('error :::', error)
    }
  }

  const isAbleTransaction = Boolean(amount?.length) && Number(amount) > 0

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
                defaultValue=""
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
          <ButtonPrimary type="submit" disabled={!isAbleTransaction}>
            {isAbleTransaction ? transactionType : 'Enter Amount'}
          </ButtonPrimary>
        </Wrapper>
      </form>
    </AppBody>
  )
}

export default Trade
