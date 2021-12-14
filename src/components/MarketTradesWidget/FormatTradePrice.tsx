import React from 'react'
import { ETHER, Price } from '@marginswap/sdk'
import { SwapInfo } from 'types'
import { useCurrency } from '../../hooks/Tokens'
import { BigNumber } from '@ethersproject/bignumber'

// the Price value is calculated by dividing the peg currency by the non-peg currency.
// So for example, if the fromToken is ETH and the toToken is USDT, the price is calculated
// by dividing the toToken amount by the fromToken amount
const FormatTradePrice = ({ swap, invert }: { swap: SwapInfo; invert: boolean }) => {
  const pair1 = useCurrency(swap.fromToken) || ETHER
  const pair2 = useCurrency(swap.toToken) || ETHER

  const tradePrice = new Price(
    pair1,
    pair2,
    BigNumber.from(swap.fromAmount).toBigInt(),
    BigNumber.from(swap.toAmount).toBigInt()
  )
  const displayPrice = !invert ? tradePrice.toSignificant(4) : tradePrice.invert().toSignificant(6)

  const label = invert ? `${pair1.symbol} per ${pair2.symbol}` : `${pair2.symbol} per ${pair1.symbol}`

  return (
    <span title={label} style={{ overflowX: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
      {displayPrice} {label}
    </span>
  )
}

export default FormatTradePrice
