import React, { useCallback } from 'react'
import { Currency } from '@marginswap/sdk'
import { LimitOrder } from 'types'
import { formatUnits } from '@ethersproject/units'
import OrderModalHeader from 'components/OrderWidget/OrderModalHeader'
import TransactionConfirmationModal, {
  ConfirmationModalContent,
  TransactionErrorContent
} from 'components/TransactionConfirmationModal'
import { useCurrency } from 'hooks/Tokens'
import CancelOrderModalFooter from './CancelOrderModalFooter'

export default function ConfirmCancelOrderModal({
  onConfirm,
  onDismiss,
  attemptingTxn,
  orderErrorMessage,
  isOpen,
  orderTxHash,
  order
}: {
  isOpen: boolean
  onConfirm: () => void
  attemptingTxn: boolean
  orderErrorMessage: string | undefined
  onDismiss: () => void
  orderTxHash: string | undefined
  cancelling?: boolean
  order: LimitOrder
}) {
  const fromToken = useCurrency(order.fromToken) || Currency.ETHER
  const toToken = useCurrency(order.toToken) || Currency.ETHER

  const inAmount = formatUnits(order.inAmount.toString(), fromToken.decimals)
  const outAmount = formatUnits(order.outAmount.toString(), toToken.decimals)

  const modalHeader = useCallback(() => {
    return <OrderModalHeader fromToken={fromToken} toToken={toToken} inAmount={inAmount} outAmount={outAmount} />
  }, [fromToken, toToken, inAmount, outAmount])

  const modalBottom = useCallback(() => {
    return <CancelOrderModalFooter onConfirm={onConfirm} orderErrorMessage={orderErrorMessage} />
  }, [onConfirm, fromToken, toToken, inAmount, outAmount])

  // text to show while loading
  const pendingText = 'Cancelling the order'

  const confirmationContent = useCallback(
    () =>
      orderErrorMessage ? (
        <TransactionErrorContent onDismiss={onDismiss} message={orderErrorMessage} />
      ) : (
        <ConfirmationModalContent
          title="Cancel Order"
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
      hash={orderTxHash}
      content={confirmationContent}
      pendingText={pendingText}
    />
  )
}
