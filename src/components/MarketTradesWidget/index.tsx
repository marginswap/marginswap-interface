import React from 'react'
import { Container, Content, Header, Item, Row, WidgetHeader } from './MarketTrades.styles'

const trades = [
  {
    id: 1,
    size: '0.1284',
    price: '38046.5',
    time: '2021/08/31 12:55'
  },
  {
    id: 2,
    size: '0.1710',
    price: '38078.7',
    time: '2021/08/31 12:54'
  },
  {
    id: 3,
    size: '0.2560',
    price: '38069.5',
    time: '2021/08/31 12:49'
  },
  {
    id: 4,
    size: '0.09305',
    price: '38032.0',
    time: '2021/08/31 12:42'
  },
  {
    id: 5,
    size: '0.2560',
    price: '37994.50',
    time: '2021/08/31 12:38'
  },
  {
    id: 6,
    size: '0.2560',
    price: '37939.60',
    time: '2021/08/31 12:36'
  },
  {
    id: 7,
    size: '0.1773',
    price: '37931.20',
    time: '2021/08/31 12:36'
  },
  {
    id: 8,
    size: '0.1720',
    price: '37968.60',
    time: '2021/08/31 12:35'
  },
  {
    id: 9,
    size: '0.1360',
    price: '38001.70',
    time: '2021/08/31 12:34'
  },
  {
    id: 10,
    size: '0.1771',
    price: '38035.30',
    time: '2021/08/31 12:32'
  },
  {
    id: 11,
    size: '0.1284',
    price: '38046.5',
    time: '2021/08/31 12:55'
  },
  {
    id: 12,
    size: '0.1710',
    price: '38078.7',
    time: '2021/08/31 12:54'
  },
  {
    id: 13,
    size: '0.2560',
    price: '38069.5',
    time: '2021/08/31 12:49'
  },
  {
    id: 14,
    size: '0.09305',
    price: '38032.0',
    time: '2021/08/31 12:42'
  },
  {
    id: 15,
    size: '0.2560',
    price: '37994.50',
    time: '2021/08/31 12:38'
  },
  {
    id: 16,
    size: '0.2560',
    price: '37939.60',
    time: '2021/08/31 12:36'
  },
  {
    id: 17,
    size: '0.1773',
    price: '37931.20',
    time: '2021/08/31 12:36'
  },
  {
    id: 18,
    size: '0.1720',
    price: '37968.60',
    time: '2021/08/31 12:35'
  },
  {
    id: 19,
    size: '0.1360',
    price: '38001.70',
    time: '2021/08/31 12:34'
  },
  {
    id: 20,
    size: '0.1771',
    price: '38035.30',
    time: '2021/08/31 12:32'
  }
]

const MarketTrades = () => {
  return (
    <Container>
      <WidgetHeader>Market Trades</WidgetHeader>
      <Header>
        <Item>Size</Item>
        <Item>Price</Item>
        <Item>Time</Item>
      </Header>
      <Content>
        {trades.map(e => (
          <Row key={e.id}>
            <Item>{e.size}</Item>
            <Item>{e.price}</Item>
            <Item>{e.time}</Item>
          </Row>
        ))}
      </Content>
    </Container>
  )
}

export default MarketTrades
