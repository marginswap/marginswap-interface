import React from 'react'
import { Container, CenterContainer, LeftContainer, WidgetContainer, RightContainer } from './ProUI.styles'

import { AdvancedChart } from 'react-tradingview-embed'
import AccountBalance from 'components/AccountBalanceWidget'
import MarketTrades from 'components/MarketTradesWidget'
import MarketWidget from 'components/MarketWidget'
import OrdersWidget from 'components/OrderListWidget'
import OrderWidget from 'components/OrderWidget'

const index = () => {
  return (
    <Container>
      <LeftContainer>
        <WidgetContainer>
          <MarketWidget />
          <OrderWidget />
        </WidgetContainer>
      </LeftContainer>
      <CenterContainer>
        <AdvancedChart key="chart" widgetProps={{ container_id: 'chart', theme: 'dark', width: '100%', height: 400 }} />
        <OrdersWidget />
      </CenterContainer>
      <RightContainer>
        <WidgetContainer>
          <AccountBalance />
          <MarketTrades />
        </WidgetContainer>
      </RightContainer>
    </Container>
  )
}

export default index
