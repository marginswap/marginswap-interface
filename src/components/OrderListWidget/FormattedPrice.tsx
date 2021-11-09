import React from 'react'
import { OrderInfo } from 'types'
import { formatUnits } from '@ethersproject/units'
import { useCurrency } from '../../hooks/Tokens'
import { Span } from './OrderListWidget.styles'

const FormattedPrice = ({ order }: { order: OrderInfo }) => {
  const currency = useCurrency(order.fromToken)
  const priceSymbol = useCurrency(order.toToken)?.symbol

  const outAmount = formatUnits(order.outAmount.toString(), currency?.decimals)
  return (
    <Span>
      {outAmount} {priceSymbol}
    </Span>
  )
}

export default FormattedPrice
