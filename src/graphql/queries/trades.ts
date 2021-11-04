import { gql, useQuery } from '@apollo/client'
import { SwapList } from 'types'

// Query the subgraph to get the Swap record where the fromToken and the toToken are the same as
// the selected pair. It does not matter which token is from and which is to - only that the Swap
// has the same tokens as the selected pair
export const marketTradesGQL = gql`
  query marketTrades($trader: Bytes, $tokens: [String]) {
    swaps(orderBy: createdAt, orderDirection: desc, where: { trader: $trader, fromToken_in: $tokens }) {
      id
      trader
      fromToken
      toToken
      fromAmount
      toAmount
      type
      createdAt
    }
  }
`

export const useMarketTradesQuery = (options = {}) => useQuery<SwapList, any>(marketTradesGQL, options)
