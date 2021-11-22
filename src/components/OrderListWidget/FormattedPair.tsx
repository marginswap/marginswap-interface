import { OrderRecord } from '@marginswap/sdk'
import React from 'react'
import { useCurrency } from '../../hooks/Tokens'
import { Span } from './OrderListWidget.styles'

const FormattedPair = ({ order }: { order: OrderRecord }) => {
  const pair1 = useCurrency(order.fromToken)?.symbol
  const pair2 = useCurrency(order.toToken)?.symbol

  return <Span>{`${pair1} - ${pair2}`}</Span>
}

export default FormattedPair
