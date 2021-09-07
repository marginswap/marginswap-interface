import React from 'react'
import { Container, CoinSelector, Content, Header, Row, Item, StyledStarIcon } from './MarketWidget.styles'

const marketValues = [
  {
    id: 1,
    symbol: 'BTC/USDT',
    symbolSubtitle: 'BTC (WBTC)',
    price: '46,830 USDT',
    priceNote: 'BTC (WBTC)',
    change: '-2.10',
    favorite: false
  },
  {
    id: 2,
    symbol: 'BTC/USDT',
    symbolSubtitle: 'BTC (WBTC)',
    price: '46,830 USDT',
    priceNote: 'BTC (WBTC)',
    change: '+2.15',
    favorite: true
  },
  {
    id: 3,
    symbol: 'BTC/USDT',
    symbolSubtitle: 'BTC (WBTC)',
    price: '46,830 USDT',
    priceNote: 'BTC (WBTC)',
    change: '-2.10',
    favorite: false
  },
  {
    id: 4,
    symbol: 'BTC/USDT',
    symbolSubtitle: 'BTC (WBTC)',
    price: '46,830 USDT',
    priceNote: 'BTC (WBTC)',
    change: '+4.25',
    favorite: false
  },
  {
    id: 5,
    symbol: 'BTC/USDT',
    symbolSubtitle: 'BTC (WBTC)',
    price: '46,830 USDT',
    priceNote: 'BTC (WBTC)',
    change: '-2.10',
    favorite: true
  }
]

const MarketWidget = () => {
  return (
    <Container>
      <CoinSelector>ETH - DAI</CoinSelector>
      <Header>
        <Item>Symbol</Item>
        <Item>Price</Item>
        <Item>Change</Item>
      </Header>
      <Content>
        {marketValues.map(mValue => (
          <Row key={mValue.id}>
            <Item>
              {mValue.symbol}
              <span>{mValue.symbolSubtitle}</span>
            </Item>
            <Item>
              {mValue.price}
              <span>{mValue.priceNote}</span>
            </Item>
            <Item>
              {mValue.change}
              <StyledStarIcon favorite={mValue.favorite} />
            </Item>
          </Row>
        ))}
      </Content>
    </Container>
  )
}

export default MarketWidget
