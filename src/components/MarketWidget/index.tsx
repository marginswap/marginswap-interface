import React, { useContext, useMemo, useEffect, useState } from 'react'
import { useActiveWeb3React } from '../../hooks'
import { SUPPORTED_PAIRS } from '../../constants'
import {
  Container,
  CoinSelector,
  Content,
  Header,
  Row,
  Item,
  ChangeValue,
  CoinSelectorHeader,
  WidgetBgImg,
  PairIcon
} from './MarketWidget.styles'
import { ChainId } from '@marginswap/sdk'
import { getTokenUSDPrice } from 'utils/coingecko'
import { CoinPair } from 'pages/Pro'
import { ProUIContext } from 'pages/Pro'
import { unwrappedTokenBySymbol } from 'utils/wrappedCurrency'

import ethIcon from '../../assets/images/eth-icon.png'
import marketWidgetBg from '../../assets/images/pairs-widget-bg.png'

const MarketWidget = () => {
  const { currentPair, setCurrentPair } = useContext(ProUIContext)
  const { chainId } = useActiveWeb3React()
  const [pairData, setPairData] = useState<[CoinPair, CoinPair][]>([])
  const pairs = useMemo(() => (chainId ? SUPPORTED_PAIRS[chainId] ?? [] : []), [chainId])

  const handleRowClick = async (pair: [CoinPair, CoinPair]) => {
    setCurrentPair(pair)
  }

  const fetchTokenPrice = async (address: string) => {
    return await getTokenUSDPrice(chainId ?? ChainId.MAINNET, address, true)
  }

  const processPairs = async () => {
    const data: any = await Promise.all(
      pairs.map(async pair => {
        const pPrice1: any = await fetchTokenPrice(pair[0].address)
        const pPrice2: any = await fetchTokenPrice(pair[1].address)

        return [
          {
            address: pair[0].address,
            symbol: pair[0].symbol,
            name: pair[0].name,
            price: pPrice1[0],
            change: parseFloat(pPrice1[1]).toFixed(2),
            unwrappedSymbol: unwrappedTokenBySymbol(pair[0].symbol)
          },
          {
            address: pair[1].address,
            symbol: pair[1].symbol,
            name: pair[1].name,
            price: pPrice2,
            change: parseFloat(pPrice2[1]).toFixed(2),
            unwrappedSymbol: unwrappedTokenBySymbol(pair[1].symbol)
          }
        ]
      })
    )

    setPairData(data)
  }

  useEffect(() => {
    processPairs()
  }, [chainId])

  useEffect(() => {
    setCurrentPair(pairData[0])
  }, [pairData])

  return (
    <Container>
      <WidgetBgImg src={marketWidgetBg} alt="eth" />
      <CoinSelector>
        <CoinSelectorHeader>
          {currentPair && currentPair[0].symbol} <PairIcon src={ethIcon} alt="eth" />{' '}
          {currentPair && currentPair[1].symbol}
        </CoinSelectorHeader>
      </CoinSelector>
      <Header>
        <Item>Symbol</Item>
        <Item>Price</Item>
        <Item>Change</Item>
      </Header>
      <Content>
        {pairData.map(pair => (
          <Row
            key={`${pair[0].symbol} + ${pair[1].symbol}`}
            onClick={() => {
              handleRowClick(pair)
            }}
          >
            <Item>
              {pair[0].symbol}/{pair[1].symbol}
              <span>{pair[0].name}</span>
            </Item>
            <Item>
              {`${pair[0].price} ${pair[1].symbol}`}
              <span>{pair[0].symbol}</span>
            </Item>
            <Item>
              <ChangeValue value={pair[0].change}>{`${pair[0].change && pair[0].change >= 0 ? '+' : ''} ${
                pair[0].change
              }`}</ChangeValue>
              {/* <StyledStarIcon /> */}
            </Item>
          </Row>
        ))}
      </Content>
    </Container>
  )
}

export default MarketWidget
