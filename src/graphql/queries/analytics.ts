import { gql, useQuery } from '@apollo/client'
import { MarginswapDayData } from 'pages/Analytics/types'

// ==========================================================

// Total Fees
// Take the above Daily Volume by Month query for MARGIN trades and multiply by 0.1%

// ==========================================================

// Top Traders (this will quickly become too heavy to do on the client)
// Take the results of the below query and group them by trader address, then:
// - convert each fromAmount to USD based on the token address
// - sum up the total USD trading volume by trader
// - display the trader addresses and USD trading volume in order from greatest to least
export const swapsGQL = gql`
  query swaps($gte: Int, $lte: Int) {
    swaps(where: { type: MARGIN, createdAt_gte: $gte, createdAt_lte: $lte }, orderBy: createdAt, first: 1000) {
      id
      trader
      fromAmount
      fromToken
      createdAt
    }
  }
`

export const marginswapData = gql`
  query marginswapData($currentDay: BigInt, $startOfMonth: BigInt, $endOfMonth: BigInt, $gte: Int, $lte: Int) {
    totalVolume: marginswapDayDatas(orderBy: createdAt, orderDirection: desc, first: 1) {
      id
      totalVolumeUSD
      createdAt
    }
    monthlyVolume: marginswapDayDatas(
      orderBy: createdAt
      where: { createdAt_gte: $startOfMonth, createdAt_lte: $endOfMonth }
    ) {
      id
      dailyVolumeUSD
      createdAt
    }
    dailyVolume: marginswapDayDatas(orderBy: createdAt, first: 1000) {
      id
      dailyVolumeUSD
      createdAt
    }
    currentVolume: marginswapDayDatas(where: { id: $currentDay }) {
      id
      dailyVolumeUSD
      createdAt
    }
    aggregatedBalances(where: { createdAt_gte: $gte, createdAt_lte: $lte }, first: 1000) {
      id
      token
      contract
      balance
      balanceType
      createdAt
      updatedAt
    }
  }
`

export const useSwapsQuery = (options = {}) => useQuery(swapsGQL, options)
export const useMarginswapDayDataQuery = (options = {}) => useQuery<MarginswapDayData>(marginswapData, options)
