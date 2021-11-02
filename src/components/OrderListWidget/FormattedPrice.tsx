import React from 'react'
import { OrderInfo } from 'types'
import { formatUnits } from '@ethersproject/units'
import { useCurrency } from '../../hooks/Tokens'

const FormattedPrice = ({ order }: { order: OrderInfo }) => {
  const currency = useCurrency(order.fromToken)
  const outAmount = formatUnits(order.outAmount.toString(), currency?.decimals)
  return <span>{outAmount}</span>
}

export default FormattedPrice
