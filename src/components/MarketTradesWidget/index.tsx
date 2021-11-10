import React, { useContext, useEffect, useState } from 'react'
import { Container, Content, Header, Item, Row, WidgetHeader } from './MarketTrades.styles'
import { useMarketTradesQuery } from 'graphql/queries/trades'
import { apolloClient } from 'config/apollo-config'
import { useActiveWeb3React } from 'hooks'
import { SwapInfo } from 'types'
import { DateTime } from 'luxon'
import { getPegCurrency, USDT_MAINNET } from '../../constants'
import { formatUnits } from '@ethersproject/units'
import { ETHER, Token } from '@marginswap/sdk'
import { ProUIContext } from 'pages/Pro'
import FormatTradePrice from './FormatTradePrice'
import { StyledBalanceMaxMini } from 'components/swap/styleds'
import { Repeat } from 'react-feather'

// Poll for new swap entities on an interval that matches the polling for margin account data
const DATA_POLLING_INTERVAL = 60 * 1000

const MarketTrades = () => {
  const { library, chainId } = useActiveWeb3React()
  const [trades, setTrades] = useState<SwapInfo[]>([])
  const { currentPair } = useContext(ProUIContext)
  const [pollingInterval, setPollingInterval] = useState<ReturnType<typeof setInterval> | null>()
  const [triggerDataPoll, setTriggerDataPoll] = useState<boolean>(true)
  const [showInverted, setShowInverted] = useState<boolean>(false)

  const { data: tradeData, refetch: reloadTrades } = useMarketTradesQuery({
    variables: {
      tokens: [currentPair && currentPair[0].address, currentPair && currentPair[1].address]
    },
    client: apolloClient(chainId)
  })

  const filterTradesByCurrentPair = () => {
    if (!tradeData) return

    const pair1 = currentPair && currentPair[0].address.toUpperCase()
    const pair2 = currentPair && currentPair[1].address.toUpperCase()

    const filteredPairs = tradeData.swaps.filter(
      t =>
        (t.fromToken.toUpperCase() === pair1 && t.toToken.toUpperCase() == pair2) ||
        (t.toToken.toUpperCase() == pair1 && t.fromToken.toUpperCase() == pair2)
    )

    setTrades(filteredPairs)
  }

  useEffect(() => {
    if (tradeData) {
      filterTradesByCurrentPair()
    }
  }, [tradeData])

  useEffect(() => {
    reloadTrades()
  }, [currentPair])

  // these next two useEffect hooks handle order data polling
  useEffect(() => {
    if (triggerDataPoll) {
      try {
        setTriggerDataPoll(false)
        reloadTrades()
      } catch (e) {
        console.error(e)
      }
    }
  }, [triggerDataPoll, library])

  useEffect(() => {
    const interval = setInterval(() => setTriggerDataPoll(true), DATA_POLLING_INTERVAL)
    setPollingInterval(interval)

    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval)
      }
    }
  }, [])

  const renderDateTime = (timestamp: string) => {
    return <span>{DateTime.fromMillis(+timestamp * 1000).toLocaleString(DateTime.DATETIME_SHORT)}</span>
  }

  const renderSize = (swap: SwapInfo) => {
    const pegCurrency = getPegCurrency(chainId) ?? (USDT_MAINNET as Token)
    let size

    if (pegCurrency.address === swap.fromToken) {
      size = formatUnits(swap.toAmount, ETHER.decimals)
    }

    size = formatUnits(swap.fromAmount, ETHER.decimals)
    return parseFloat(size).toFixed(6)
  }

  const renderTrades = () => {
    if (trades && trades.length > 0) {
      return trades.map((swap: SwapInfo) => (
        <Row key={swap.id}>
          <Item>{renderSize(swap)}</Item>
          <Item>
            <FormatTradePrice swap={swap} invert={showInverted} />
          </Item>
          <Item>{renderDateTime(swap.createdAt)}</Item>
        </Row>
      ))
    }

    return null
  }

  return (
    <Container>
      <WidgetHeader>Market Trades</WidgetHeader>
      <Header>
        <Item>Size</Item>
        <Item>
          Price
          <StyledBalanceMaxMini onClick={() => setShowInverted(!showInverted)}>
            <Repeat size={14} />
          </StyledBalanceMaxMini>
        </Item>
        <Item>Time</Item>
      </Header>
      <Content>{renderTrades()}</Content>
    </Container>
  )
}

export default MarketTrades
