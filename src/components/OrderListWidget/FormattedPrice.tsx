import React from 'react'
import { OrderInfo } from 'types'
import { formatUnits } from '@ethersproject/units'
import { useCurrency } from '../../hooks/Tokens'
import { Span } from './OrderListWidget.styles'

const FormattedPrice = ({ order }: { order: OrderInfo }) => {
  const currency = useCurrency(order.toToken)
  const priceSymbol = useCurrency(order.fromToken)?.symbol

  const inAmount = formatUnits(order.inAmount.toString(), currency?.decimals)
  return (
    <Span>
      {inAmount} {priceSymbol}
    </Span>
  )
}

export default FormattedPrice
