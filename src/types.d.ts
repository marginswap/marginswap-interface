export interface OrderInfo {
  readonly id: number
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
