import React from 'react'
import styled from 'styled-components'
import { Star } from 'react-feather'

const Container = styled.div`
  display: flex;
  flex-direction: column;
`

const CoinSelector = styled.div`
  padding-top: 10px;
  color: white;
  text-align: center;
  height: 40px;
  border-bottom: 1px solid #373738;
`

const Content = styled.div`
  display: flex;
  flex-wrap: wrap;
  overflow-y: auto;
  padding-left: 5px;
  padding-right: 5px;
  max-height: 240px;
  margin-bottom: 15px;

  > div {
    margin-bottom: 10px;
  }
`

const Header = styled.div`
  display: flex;
  flex-direction: row;
  padding: 8px;
  width: 100%;
  margin-bottom: 4px;

  > div {
    font-size: 12px;
    width: 38%;
  }

  > div:last-child {
    width: 26%;
  }
`

const Row = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  padding: 5px;

  > div {
    display: flex;
    flex-direction: column;
    width: 38%;
  }

  > div:last-child {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    width: 26%;

    > svg {
      margin-left: 7px;
    }
  }

  :hover {
    background: linear-gradient(90deg, rgba(34, 95, 74, 0.75) 0%, rgba(43, 50, 109, 0.75) 100%);
  }
`

const Item = styled.div`
  color: white;
  width: 100%;

  font-size: 12px;

  > span {
    font-size: 0.6rem;
    color: #a7a7a7;
  }
`

export const StyledStarIcon = styled(Star)<{ favorite: boolean }>`
  height: 13px;
  width: 13px;

  > * {
    stroke: ${({ theme }) => theme.text2};
    fill: ${props => (props.favorite ? 'yellow' : 'none')};
  }

  :hover {
    opacity: 0.7;
  }
`

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
