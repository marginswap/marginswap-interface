import React from 'react'
import { OrderInfo } from 'types'
import { formatUnits } from '@ethersproject/units'
import { useCurrency } from '../../hooks/Tokens'
import { Span } from './OrderListWidget.styles'

const FormattedAmount = ({ order }: { order: OrderInfo }) => {
  const tokenSymbol = useCurrency(order.fromToken)?.symbol
  const currency = useCurrency(order.toToken)
  return (
    <Span>
      {formatUnits(order.inAmount.toString(), currency?.decimals)} {tokenSymbol}
    </Span>
  )
}

export default FormattedAmount
