import React from 'react'
import { ChainId, Token } from '@marginswap/sdk'
import { Web3Provider } from '@ethersproject/providers/lib/web3-provider'
import TransactionConfirmationModal, {
  ConfirmationModalContent,
  TransactionErrorContent
} from '../TransactionConfirmationModal'
import MFIData from './MFIData'
import LiquidityData from './LiquidityData'
import StakeModalHeader from './StakeModalHeader'
import { ButtonPrimary } from '../Button'
import { AutoRow } from '../Row'

interface ModalStakeData {
  token: Token
  chainId?: ChainId | undefined
  provider?: Web3Provider | undefined
  address?: string | undefined
  period: number
  mfiStake: boolean
  amount: string
  attemptingTxn: boolean
  txHash: string | undefined
  onConfirm: () => void
  onDismiss: () => void
  isOpen: boolean
  stakeErrorMsn: string | undefined
}

export default function ConfirmStakeModal({
  token,
  chainId,
  provider,
  address,
  period,
  mfiStake,
  amount,
  attemptingTxn,
  txHash,
  onDismiss,
  onConfirm,
  isOpen,
  stakeErrorMsn
}: ModalStakeData) {
  const modalHeader = () => {
    return <StakeModalHeader token={token} amount={amount} />
  }

  const modalBottom = () => {
    return (
      <>
        {mfiStake ? (
          <MFIData chainId={chainId} provider={provider} address={address} period={period} />
        ) : (
          <LiquidityData chainId={chainId} provider={provider} address={address} period={period} />
        )}
        <ButtonPrimary onClick={onConfirm} height="63px" id="swap-button-1">
          <AutoRow gap="6px" justify="center">
            Confirm Stake
          </AutoRow>
        </ButtonPrimary>
      </>
    )
  }

  // text to show while loading
  const pendingText = `Staking ${amount} MFI`

  const confirmationContent = () =>
    stakeErrorMsn ? (
      <TransactionErrorContent onDismiss={onDismiss} message={stakeErrorMsn} />
    ) : (
      <ConfirmationModalContent
        title="Confirm Stake"
        onDismiss={onDismiss}
        topContent={modalHeader}
        bottomContent={modalBottom}
      />
    )

  return (
    <TransactionConfirmationModal
      isOpen={isOpen}
      onDismiss={onDismiss}
      attemptingTxn={attemptingTxn}
      hash={txHash}
      content={confirmationContent}
      pendingText={pendingText}
    />
  )
}
