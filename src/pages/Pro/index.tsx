import React from 'react'
import { AdvancedChart } from 'react-tradingview-embed'
import MarketTrades from '../../components/MarketTrades'
import styled from 'styled-components'
import AccountBalance from 'components/AccountBalance'
import Swap from 'pages/Swap'

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
`

const RightContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 30%;
`

const WidgetContainer = styled.div`
  background-color: #1d1d23;
  min-height: 400px;
  margin: 0 10px 10px 5px;
  border-radius: 7px;
`

const index = () => {
  return (
    <Container>
      <LeftContainer>
        <WidgetContainer>
          <Swap roundedBody={false} />
        </WidgetContainer>
        {/* <WidgetContainer></WidgetContainer> */}
      </LeftContainer>
      <CenterContainer>
        <AdvancedChart key="chart" widgetProps={{ container_id: 'chart', theme: 'dark', width: 770, height: 500 }} />
      </CenterContainer>
      <RightContainer>
        {/* <WidgetContainer>
          <AccountBalance />
        </WidgetContainer>
        <WidgetContainer>
          <MarketTrades />
        </WidgetContainer> */}
      </RightContainer>
    </Container>
  )
}

export default index
