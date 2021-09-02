import React from 'react'
import { AdvancedChart } from 'react-tradingview-embed'
import styled from 'styled-components'
import Swap from 'pages/Swap'
import AccountBalance from 'components/AccountBalanceWidget'
import MarketTrades from 'components/MarketTradesWidget'
import MarketWidget from 'components/MarketWidget'
import OrdersWidget from 'components/OrdersWidget'

const Container = styled.div`
  display: flex;
  flex-direction: row;
  width: 80%;
`

const LeftContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 30%;
`

const CenterContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 770px;

  > div {
    border: 1px solid #525252;
  }
`

const RightContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 30%;
`

const WidgetContainer = styled.div`
  background-color: #161618;
  min-height: 200px;
  margin: 0 10px 10px 5px;
  border-radius: 7px;
`

const index = () => {
  return (
    <Container>
      <LeftContainer>
        <WidgetContainer>
          <MarketWidget />
        </WidgetContainer>
        <WidgetContainer>
          <Swap roundedBody={false} />
        </WidgetContainer>
      </LeftContainer>
      <CenterContainer>
        <AdvancedChart key="chart" widgetProps={{ container_id: 'chart', theme: 'dark', width: 770, height: 500 }} />
        <OrdersWidget />
      </CenterContainer>
      <RightContainer>
        <WidgetContainer>
          <AccountBalance />
        </WidgetContainer>
        <WidgetContainer>
          <MarketTrades />
        </WidgetContainer>
      </RightContainer>
    </Container>
  )
}

export default index
