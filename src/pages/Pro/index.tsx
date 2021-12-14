import React, { createContext, useEffect, useState } from 'react'
import {
  Container,
  CenterContainer,
  ChartContainer,
  LeftContainer,
  WidgetContainer,
  RightContainer
} from './ProUI.styles'

import { AdvancedChart } from 'react-tradingview-embed'
import AccountBalance from 'components/AccountBalanceWidget'
import MarketTrades from 'components/MarketTradesWidget'
import MarketWidget from 'components/MarketWidget'
import OrderListWidget from 'components/OrderListWidget'
import OrderWidget from 'components/OrderWidget'

export type CoinPair = {
  address: string
  symbol: string
  name: string
  price?: string
  change?: number
  unwrappedSymbol?: string
}

export type Context = {
  currentPair: [CoinPair, CoinPair] | null
  setCurrentPair: (c: [CoinPair, CoinPair]) => void
  pendingOrderTx: string | null
  setPendingOrderTx: (pendingTx: string) => void
}

export const ProUIContext = createContext<Context>({
  currentPair: null,
  setCurrentPair: () => null,
  pendingOrderTx: null,
  setPendingOrderTx: () => null
})

const Pro = () => {
  const [currentPair, setCurrentPair] = useState<[CoinPair, CoinPair]>([
    { address: '', symbol: '', name: '' },
    { address: '', symbol: '', name: '' }
  ])
  const [, setCurrentSymbol] = useState<string>('WETHUSDT')
  const [advancedChart, setAdvancedChart] = useState<JSX.Element>()
  const [pendingOrderTx, setPendingOrderTx] = useState('')

  useEffect(() => {
    if (currentPair && currentPair[0].unwrappedSymbol) {
      let currentPairCombinedSymbol = currentPair[0].unwrappedSymbol && currentPair[0].unwrappedSymbol
      currentPairCombinedSymbol += currentPair[1].unwrappedSymbol && currentPair[1].unwrappedSymbol
      setCurrentSymbol(currentPairCombinedSymbol)

      const advancedChartComponent = (
        <AdvancedChart
          key="chart"
          widgetProps={{
            allow_symbol_change: true,
            container_id: currentPairCombinedSymbol,
            symbol: currentPairCombinedSymbol,
            theme: 'dark',
            width: '100%',
            height: 400
          }}
          widgetPropsAny={{ timestamp: Date.now() }}
        />
      )
      setAdvancedChart(advancedChartComponent)
    }
  }, [currentPair])

  return (
    <ProUIContext.Provider value={{ currentPair, setCurrentPair, pendingOrderTx, setPendingOrderTx }}>
      <Container>
        <LeftContainer>
          <WidgetContainer>
            <MarketWidget />
            <OrderWidget />
          </WidgetContainer>
        </LeftContainer>
        <CenterContainer>
          <ChartContainer>{advancedChart}</ChartContainer>
          <OrderListWidget />
        </CenterContainer>
        <RightContainer>
          <WidgetContainer>
            <AccountBalance />
            <MarketTrades />
          </WidgetContainer>
        </RightContainer>
      </Container>
    </ProUIContext.Provider>
  )
}

export default Pro
