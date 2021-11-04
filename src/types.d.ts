export interface OrderInfo {
  readonly id: string
  readonly maker: string
  readonly fromToken: string
  readonly toToken: string
  readonly inAmount: number
  readonly outAmount: number
  readonly amountTaken: number
  readonly remainingInAmount: number
  readonly expiration: number
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
