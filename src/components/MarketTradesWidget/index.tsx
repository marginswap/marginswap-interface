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
import Loader from 'components/Loader'

// Poll for new swap entities on an interval that matches the polling for margin account data
const DATA_POLLING_INTERVAL = 60 * 1000

const MarketTrades = () => {
  const { library, account, chainId } = useActiveWeb3React()
  const [trades, setTrades] = useState<SwapInfo[]>([])
  const { currentPair } = useContext(ProUIContext)
  const [pollingInterval, setPollingInterval] = useState<ReturnType<typeof setInterval> | null>()
  const [triggerDataPoll, setTriggerDataPoll] = useState<boolean>(true)

  const {
    data: tradeData,
    loading: loadingTrades,
    refetch: reloadTrades
  } = useMarketTradesQuery({
    variables: {
      trader: account,
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

    if (pegCurrency.address === swap.fromToken) {
      return formatUnits(swap.toAmount, ETHER.decimals)
    }

    return formatUnits(swap.fromAmount, ETHER.decimals)
  }

  const renderTrades = () => {
    if (trades) {
      return trades.map((swap: SwapInfo) => (
        <Row key={swap.id}>
          <Item>{renderSize(swap)}</Item>
          <Item>
            <FormatTradePrice swap={swap} />
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
        <Item>Price</Item>
        <Item>Time</Item>
      </Header>
      <Content>{loadingTrades ? <Loader /> : renderTrades()}</Content>
    </Container>
  )
}

export default MarketTrades
