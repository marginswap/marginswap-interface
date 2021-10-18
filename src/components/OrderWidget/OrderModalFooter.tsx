import React from 'react'
import { Text } from 'rebass'
import { ButtonError } from '../Button'
import { AutoRow } from '../Row'
import { SwapCallbackError } from '../swap/styleds'

const OrderModalFooter = ({
  onConfirm,
  orderErrorMessage
}: {
  onConfirm: () => void
  orderErrorMessage: string | undefined
}) => {
  return (
    <AutoRow>
      <ButtonError onClick={onConfirm} style={{ margin: '10px 0 0 0' }} id="confirm-swap-or-send">
        <Text fontSize={20} fontWeight={500}>
          Confirm Order
        </Text>
      </ButtonError>

      {orderErrorMessage ? <SwapCallbackError error={orderErrorMessage} /> : null}
    </AutoRow>
  )
}

export default OrderModalFooter
