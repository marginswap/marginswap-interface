import React, { useState, ChangeEvent, useEffect } from 'react'
import {
  getMFIStaking,
  getLiquidityMiningReward,
  getMFIAPRPerWeight,
  getLiquidityAPRPerWeight,
  canWithdraw
} from '@marginswap/sdk'

import AppBody from '../../pages/AppBody'
import { TYPE, StyledButton } from '../../theme'
import { RowBetween } from '../../components/Row'
import { ButtonPrimary } from '../../components/Button'
import Select from '../../components/Select'
import ToggleSelector from '../../components/ToggleSelector'

import { DropdownsContainer, DataContainer, StyledOutlinedInput, StyledStakeHeader } from './styleds'
import { PaddedColumn, BottomGrouping, Wrapper } from '../../components/swap/styleds'

import { useActiveWeb3React } from '../../hooks'

const Transact = () => {
  const [actionAmount, setActionAmount] = useState('')
  const [mfiStake, setMfiStake] = useState(true)

  const { chainId, library } = useActiveWeb3React()

  console.log({ library })

  console.log(`chainId: ${chainId}, MFIStake: ${mfiStake}`)

  useEffect(() => {
    if (mfiStake && chainId && library) {
      const contract1 = getMFIStaking(chainId, library)
      console.log({ contract1 })

      getMFIAPRPerWeight(contract1, library)
        .then((aprData: any) => console.log({ aprData }))
        .catch(e => {
          console.log('APR ERROR MESSAGE :::', e.message)
        })

      canWithdraw(contract1, '0xE653DDeebF6778A56Dd9BCda5a3B91D53023AB28')
        .then((canWithdrawData: any) => console.log({ canWithdrawData }))
        .catch(e => {
          console.log('CAN WITHDRAW ERROR MESSAGE :::', e.message)
        })
    }
  }, [mfiStake, chainId, library])

  const handleActionValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    setActionAmount(inputValue)
  }
  return (
    <AppBody>
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
          <Select options={['Deposit', 'Claim', 'Withdraw']} />
          <Select options={['One week', 'One month', 'Three months']} />
        </DropdownsContainer>
        <DataContainer>
          <span>
            Estimated APR: <strong>20%</strong>
          </span>
          <span>
            Current staked balance: <strong>0 MFI</strong>
          </span>

          <span>
            Available for withdrawal after: <strong>August 6th 2021</strong>
          </span>
        </DataContainer>
        <StyledOutlinedInput
          label="Amount"
          onChange={handleActionValueChange}
          value={actionAmount}
          endAdornment={
            <StyledButton onClick={() => false} disabled={false}>
              MAX
            </StyledButton>
          }
          inputProps={{
            'aria-label': ''
          }}
          labelWidth={0}
        />
        <BottomGrouping>
          <ButtonPrimary>
            <TYPE.main mb="4px">Deposit</TYPE.main>
          </ButtonPrimary>
        </BottomGrouping>
      </Wrapper>
    </AppBody>
  )
}

export default Transact
