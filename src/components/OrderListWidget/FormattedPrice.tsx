import React from 'react'
import { formatUnits } from '@ethersproject/units'
import { useCurrency } from '../../hooks/Tokens'
import { Span } from './OrderListWidget.styles'
import { OrderRecord } from '@marginswap/sdk'

const FormattedPrice = ({ order }: { order: OrderRecord }) => {
  const fromToken = useCurrency(order.fromToken)

  const inAmount = formatUnits(order.inAmount.toString(), fromToken?.decimals)
  return (
    <Span>
      {inAmount} {fromToken?.symbol}
    </Span>
  )
}

export default FormattedPrice
