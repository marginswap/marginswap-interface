import React from 'react'
import { OrderInfo } from 'types'
import { useCurrency } from '../../hooks/Tokens'

const FormattedPair = ({ order }: { order: OrderInfo }) => {
  const pair1 = useCurrency(order.fromToken)?.symbol
  const pair2 = useCurrency(order.toToken)?.symbol

  return <span>{`${pair1} - ${pair2}`}</span>
}

export default FormattedPair
