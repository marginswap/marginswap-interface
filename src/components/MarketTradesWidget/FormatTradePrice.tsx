import React from 'react'
import { ETHER, Price } from '@marginswap/sdk'
import { SwapInfo } from 'types'
import { useCurrency } from '../../hooks/Tokens'
import { parseUnits } from '@ethersproject/units'

// the Price value is calculated by dividing the peg currency by the non-peg currency.
// So for example, if the fromToken is ETH and the toToken is USDT, the price is calculated
// by dividing the toToken amount by the fromToken amount
const FormatTradePrice = ({ swap, invert }: { swap: SwapInfo; invert: boolean }) => {
  const pair1 = useCurrency(swap.fromToken) || ETHER
  const pair2 = useCurrency(swap.toToken) || ETHER

  const inAmount = parseUnits(swap.fromAmount.toString(), pair1.decimals)
  const outAmount = parseUnits(swap.toAmount.toString(), pair2.decimals)

  const tradePrice = new Price(pair1, pair2, inAmount.toBigInt(), outAmount.toBigInt())
  const displayPrice = !invert ? tradePrice.toSignificant(4) : tradePrice.invert().toSignificant(6)

  return (
    <span title={displayPrice} style={{ overflowX: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
      {displayPrice}
    </span>
  )
}

export default FormatTradePrice
