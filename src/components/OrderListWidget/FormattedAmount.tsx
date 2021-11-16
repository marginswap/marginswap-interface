import React from 'react'
import { OrderInfo } from 'types'
import { formatUnits } from '@ethersproject/units'
import { useCurrency } from '../../hooks/Tokens'
import { Span } from './OrderListWidget.styles'

const FormattedAmount = ({ order }: { order: OrderInfo }) => {
  const tokenSymbol = useCurrency(order.toToken)?.symbol
  const currency = useCurrency(order.fromToken)
  return (
    <Span>
      {formatUnits(order.outAmount.toString(), currency?.decimals)} {tokenSymbol}
    </Span>
  )
}

export default FormattedAmount
