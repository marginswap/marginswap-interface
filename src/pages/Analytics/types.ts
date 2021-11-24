export interface VolumeSwaps {
  polygonData: Swap[]
  avalancheData: Swap[]
  bscData: Swap[]
  ethData: Swap[]
}

export interface Swap {
  fromAmount: string
  fromToken: string
  id: string
  trader: string
  createdAt: string
}

export interface SwapVolume {
  id: string
  createdAt: string
  token: string
  volume: string
  type: string
  updatedAt: string | null
}

export interface AggregateBalance {
  balance: string
  balanceType: string
  id: string
  token: string
  createdAt: string
  contract: string
  updatedAt: string | null
}

export interface GetAggregateBalances {
  aggregateBalancesPolygon: AggregateBalance[]
  aggregateBalancesAvalanche: AggregateBalance[]
  aggregateBalancesBsc: AggregateBalance[]
  aggregateBalancesEth: AggregateBalance[]
}

export interface AggregateBalances {
  avalancheData: AggregateBalance[]
  polygonData: AggregateBalance[]
  bscData: AggregateBalance[]
  ethData: AggregateBalance[]
}

export interface GetDailyVolume {
  dailyPolygonSwapVolumes: SwapVolume[]
  dailyAvalancheSwapVolumes: SwapVolume[]
  dailyBscSwapVolumes: SwapVolume[]
  dailyEthSwapVolumes: SwapVolume[]
}

export interface TokensMap {
  [key: string]: { usd: number }
}

export interface Trader {
  address: string
  dailyVolume: number
  weeklyVolume: number
  monthlyVolume: number
}

export interface StatsProps {
  totalDailyVolume: number
  dailySwap: ChartData[]
}

export interface ChartData {
  time: string
  value: number
}
