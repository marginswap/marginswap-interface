import { gql, useQuery } from '@apollo/client'
import { OrderList } from 'types'

// For the "Limit orders" list, show all Order entities where the maker address matches the user's
// address and where the remainingInAmount is greater than zero
export const limitOrdersGQL = gql`
  query limitOrders($maker: Bytes) {
    orders(orderBy: createdAt, orderDirection: desc, where: { maker: $maker, remainingInAmount_gt: 0 }) {
      id
      fromToken
      toToken
      inAmount
      outAmount
      maker
      expiration
      remainingInAmount
      amountTaken
      createdAt
      updatedAt
    }
  }
`

// For the "Order history" list, show all Order entities where the maker address matches the user's
// address and where the remainingInAmount is zero
export const limitOrderHistoryGQL = gql`
  query limitOrders($maker: Bytes) {
    orders(orderBy: createdAt, orderDirection: desc, where: { maker: $maker, remainingInAmount: 0 }) {
      id
      fromToken
      toToken
      inAmount
      outAmount
      maker
      expiration
      remainingInAmount
      amountTaken
      createdAt
      updatedAt
    }
  }
`
export const useLimitOrdersQuery = (options = {}) => useQuery<OrderList, any>(limitOrdersGQL, options)
export const useLimitOrdersHistoryQuery = (options = {}) => useQuery<OrderList, any>(limitOrderHistoryGQL, options)
