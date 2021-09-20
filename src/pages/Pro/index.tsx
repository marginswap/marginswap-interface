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
import OrdersWidget from 'components/OrderListWidget'
import OrderWidget from 'components/OrderWidget'

export type CoinPair = {
  address?: string
  symbol?: string
  name?: string
  price?: string
  change?: number
}

export type Context = {
  currentPair: [CoinPair, CoinPair] | null
  setCurrentPair: (c: [CoinPair, CoinPair]) => void
}

export const ProUIContext = createContext<Context>({
  currentPair: null,
  setCurrentPair: () => null
})

const Pro = () => {
  const [currentPair, setCurrentPair] = useState<[CoinPair, CoinPair]>([{}, {}])
  const [currentSymbol, setCurrentSymbol] = useState<string>('WETHUSDT')
  const [advancedChart, setAdvancedChart] = useState<JSX.Element>()

  useEffect(() => {
    if (currentPair && currentPair[0].symbol) {
      let currentPairCombinedSymbol = currentPair[0].symbol && currentPair[0].symbol
      currentPairCombinedSymbol += currentPair[1].symbol && currentPair[1].symbol
      setCurrentSymbol(currentPairCombinedSymbol)

      const test = (
        <AdvancedChart
          key="chart"
          widgetProps={{
            container_id: currentPairCombinedSymbol,
            symbol: currentPairCombinedSymbol,
            theme: 'dark',
            width: '100%',
            height: 400
          }}
          widgetPropsAny={{ timestamp: Date.now() }}
        />
      )
      setAdvancedChart(test)
    }
  }, [currentPair])

  return (
    <ProUIContext.Provider value={{ currentPair, setCurrentPair }}>
      <Container>
        <LeftContainer>
          <WidgetContainer>
            <MarketWidget />
            <OrderWidget />
          </WidgetContainer>
        </LeftContainer>
        <CenterContainer>
          <ChartContainer>{advancedChart}</ChartContainer>
          <OrdersWidget />
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
