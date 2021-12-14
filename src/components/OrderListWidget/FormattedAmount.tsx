import React from 'react'
import { formatUnits } from '@ethersproject/units'
import { useCurrency } from '../../hooks/Tokens'
import { Span } from './OrderListWidget.styles'
import { OrderRecord } from '@marginswap/sdk'

const FormattedAmount = ({ order }: { order: OrderRecord }) => {
  const toToken = useCurrency(order.toToken)

  return (
    <Span>
      {formatUnits(order.outAmount.toString(), toToken?.decimals)} {toToken?.symbol}
    </Span>
  )
}

export default FormattedAmount
