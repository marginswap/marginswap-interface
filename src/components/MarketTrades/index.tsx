import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  padding: 5px 10px;
  color: #fff;
`

const Content = styled.div`
  display: flex;
  flex-wrap: wrap;
  overflow-y: auto;
  padding-left: 5px;

  > div {
    margin-bottom: 10px;
  }
`

const Item = styled.div`
  font-size: 12px;
  width: 100%;
`

const Row = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;

  > div {
    width: 30%;
  }

  > div:last-child {
    width: 40%;
  }
`

const Header = styled.div`
  background-color: #2b2b2c;
  display: flex;
  flex-direction: row;
  padding: 8px;
  width: 100%;
  margin-bottom: 4px;

  > div {
    font-size: 14px;
    width: 30%;
  }

  > div:last-child {
    width: 40%;
  }
`

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
  }
]

const MarketTrades = () => {
  return (
    <Container>
      <h5>Market Trades</h5>
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
