import { gql, useQuery } from '@apollo/client'

// Daily Volume for all available dates (this will get too heavy to do on the client at some point)
// Convert createdAt to a javascript date like this:
// New Date(createdAt * 1000)

// To display the volume, divide the volume by the 1^tokenDecimals where tokenDecimals is the number of
// decimals the token uses, for example if the token uses 18 decimals, volume / 100000000000000000

// Look up the token name and logo via the address (maybe this can be gotten from the TokenList in the interface?)

// Get the price of the token in USD from the CoinGecko or other API and convert it to USD

// Sum up all of the token volumes to get totaly daily volume

// Change the value of "type" to SPOT to get daily volume of spot trades
export const swapVolumesGQL = gql`
  query swapVolumes($gte: Int, $lte: Int) {
    dailySwapVolumes(where: { type: MARGIN, createdAt_gte: $gte, createdAt_lte: $lte }, orderBy: createdAt) {
      id
      token
      volume
      createdAt
    }
  }
`

// =========================================================

// Daily Volume by Month
// 1. Calculate the javascript date of the first and last days of the month
// 2. Call the getTime() method on the javascript date class and divide it by 1000
//    to get the subgraph createdAt timestamp, for example:
//    new Date(firstDayOfMonth).getTime() / 1000
// 3. Pass those values as createdAt_gte and createdAt_lte to restrict the results to only one month

// Change the value of "type" to SPOT to get daily volume of spot trades

// see above for how to display volume numbers and token abbreviations/logos

export const dailySwapVolumesByMonthGQL = gql`
  query dailySwapVolumes {
    dailySwapVolumes(
      where: { type: MARGIN, createdAt_gte: "1624999268", createdAt_lte: "1625735219" }
      orderBy: createdAt
    ) {
      id
      token
      volume
      createdAt
    }
  }
`

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
    swaps(where: { type: MARGIN, createdAt_gte: $gte, createdAt_lte: $lte }, orderBy: createdAt) {
      id
      trader
      fromAmount
      fromToken
      createdAt
    }
  }
`

// ===========================================================

// Total Value Locked
// Take the results of the below query, then:
// - get the token decimals and convert balance to number of tokens
// - get the price of the token from the CoinGecko or other API
// - convert the token balance to USD
// - sum up the USD balances of each type of balance

// The balance types are CROSS_MARGIN_HOLDING, CROSS_MARGIN_DEBT, and BOND_DEPOSIT

export const aggregatedBalancesGQL = gql`
  query aggregatedBalances {
    aggregatedBalances {
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

export const useSwapVolumesQuery = (options = {}) => useQuery(swapVolumesGQL, options)
export const useDailySwapVolumesByMonthQuery = (options = {}) => useQuery(dailySwapVolumesByMonthGQL, options)
export const useSwapsQuery = (options = {}) => useQuery(swapsGQL, options)
export const useAggregatedBalancesQuery = (options = {}) => useQuery(aggregatedBalancesGQL, options)
