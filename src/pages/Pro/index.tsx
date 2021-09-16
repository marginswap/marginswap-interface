import React, { createContext, useState } from 'react'
import { Container, CenterContainer, LeftContainer, WidgetContainer, RightContainer } from './ProUI.styles'

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

const index = () => {
  const [currentPair, setCurrentPair] = useState<[CoinPair, CoinPair]>([{}, {}])

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
          <AdvancedChart
            key="chart"
            widgetProps={{ container_id: 'chart', theme: 'dark', width: '100%', height: 400 }}
          />
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

export default index
