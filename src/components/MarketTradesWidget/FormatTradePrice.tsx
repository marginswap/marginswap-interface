import React from 'react'
import { useActiveWeb3React } from 'hooks'
import { getPegCurrency, USDT_MAINNET } from '../../constants'
import { Token } from '@marginswap/sdk'
import { SwapInfo } from 'types'

// the Price value is calculated by dividing the peg currency by the non-peg currency.
// So for example, if the fromToken is ETH and the toToken is USDT, the price is calculated
// by dividing the toToken amount by the fromToken amount
const FormatTradePrice = ({ swap }: { swap: SwapInfo }) => {
  const { chainId } = useActiveWeb3React()
  const pegCurrency = getPegCurrency(chainId) ?? (USDT_MAINNET as Token)

  // from token is the peg currency. dividing peg / non-peg
  if (pegCurrency.address === swap.fromToken) {
    return <span>{(swap.fromAmount / swap.toAmount).toFixed(4)}</span>
  } else {
    return <span>{(swap.toAmount / swap.fromAmount).toFixed(4)}</span>
  }
}

export default FormatTradePrice
