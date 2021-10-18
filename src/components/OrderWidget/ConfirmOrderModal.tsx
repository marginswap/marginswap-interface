import { Currency } from '@marginswap/sdk'
import TransactionConfirmationModal, {
  ConfirmationModalContent,
  TransactionErrorContent
} from 'components/TransactionConfirmationModal'
import React, { useCallback } from 'react'
import OrderModalFooter from './OrderModalFooter'
import OrderModalHeader from './OrderModalHeader'

const ConfirmOrderModal = ({
  onConfirm,
  onDismiss,
  attemptingTxn,
  orderErrorMessage,
  isOpen,
  fromToken,
  toToken,
  inAmount,
  outAmount
}: {
  isOpen: boolean
  onConfirm: () => void
  attemptingTxn: boolean
  orderErrorMessage: string | undefined
  onDismiss: () => void
  fromToken: Currency
  toToken: Currency
  inAmount: string
  outAmount: string
}) => {
  const modalHeader = useCallback(() => {
    return <OrderModalHeader fromToken={fromToken} toToken={toToken} inAmount={inAmount} outAmount={outAmount} />
  }, [fromToken, toToken, inAmount, outAmount])

  const modalBottom = useCallback(() => {
    return <OrderModalFooter onConfirm={onConfirm} orderErrorMessage={orderErrorMessage} />
  }, [onConfirm, fromToken, toToken, inAmount, outAmount])

  // text to show while loading
  const pendingText = `Making an order of ${inAmount} ${fromToken.symbol} for ${outAmount} ${toToken.symbol}`

  const confirmationContent = useCallback(
    () =>
      orderErrorMessage ? (
        <TransactionErrorContent onDismiss={onDismiss} message={orderErrorMessage} />
      ) : (
        <ConfirmationModalContent
          title="Confirm Order"
          onDismiss={onDismiss}
          topContent={modalHeader}
          bottomContent={modalBottom}
        />
      ),
    [onDismiss, modalBottom, modalHeader, orderErrorMessage]
  )

  return (
    <TransactionConfirmationModal
      isOpen={isOpen}
      onDismiss={onDismiss}
      attemptingTxn={attemptingTxn}
      hash=""
      content={confirmationContent}
      pendingText={pendingText}
    />
  )
}

export default ConfirmOrderModal
