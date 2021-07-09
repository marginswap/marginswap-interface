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
          <MFIData chainId={chainId} provider={provider} address={address} />
        ) : (
          <LiquidityData chainId={chainId} provider={provider} address={address} />
        )}
        <ButtonPrimary onClick={onConfirm} height="63px" id="swap-button-1">
          <AutoRow gap="6px" justify="center">
            Confirm transaction
          </AutoRow>
        </ButtonPrimary>
      </>
    )
  }

  // text to show while loading
  const pendingText = `Staking ${amount} MFI`

  const confirmationContent = () =>
    stakeErrorMsn && stakeErrorMsn?.length > 0 ? (
      <TransactionErrorContent onDismiss={onDismiss} message={stakeErrorMsn} />
    ) : (
      <ConfirmationModalContent
        title="Confirm transaction"
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
