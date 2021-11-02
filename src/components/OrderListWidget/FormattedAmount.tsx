import React from 'react'
import { OrderInfo } from 'types'
import { formatUnits } from '@ethersproject/units'
import { useCurrency } from '../../hooks/Tokens'

const FormattedAmount = ({ order }: { order: OrderInfo }) => {
  const currency = useCurrency(order.toToken)
  return <span>{formatUnits(order.inAmount.toString(), currency?.decimals)}</span>
}

export default FormattedAmount
