import { BigNumber } from '@ethersproject/bignumber'

export interface OrderInfo {
  readonly id: string
  readonly maker: string
  readonly fromToken: string
  readonly toToken: string
  readonly inAmount: BigNumber
  readonly outAmount: BigNumber
  readonly amountTaken: BigNumber
  readonly remainingInAmount: BigNumber
  readonly expiration: BigNumber
  readonly createdAt: string
  readonly updatedAt: string
}

export interface OrderList {
  readonly orders: OrderInfo[]
}

export interface SwapInfo {
  readonly id: string
  readonly trader: string
  readonly fromToken: string
  readonly toToken: string
  readonly fromAmount: number
  readonly toAmount: number
  readonly type: string
  readonly createdAt: string
}

export interface SwapList {
  readonly swaps: SwapInfo[]
}

export interface LimitOrder {
  readonly id: string
  readonly maker: string
  readonly fromToken: string
  readonly toToken: string
  readonly inAmount: BigNumber
  readonly outAmount: BigNumber
  readonly expiration: BigNumber
}
