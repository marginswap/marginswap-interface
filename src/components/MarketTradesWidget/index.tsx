import React, { useContext, useEffect, useState } from 'react'
import { Container, Content, WidgetHeader } from './MarketTrades.styles'
import { useMarketTradesQuery } from 'graphql/queries/trades'
import { apolloClient } from 'config/apollo-config'
import { useActiveWeb3React } from 'hooks'
import { SwapInfo } from 'types'
import { ProUIContext } from 'pages/Pro'
import TradeItem from './TradeItem'

// Poll for new swap entities on an interval that matches the polling for margin account data
const DATA_POLLING_INTERVAL = 60 * 1000

const MarketTrades = () => {
  const { library, chainId } = useActiveWeb3React()
  const [trades, setTrades] = useState<SwapInfo[]>([])
  const { currentPair } = useContext(ProUIContext)
  const [pollingInterval, setPollingInterval] = useState<ReturnType<typeof setInterval> | null>()
  const [triggerDataPoll, setTriggerDataPoll] = useState<boolean>(true)

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

  const renderTrades = () => {
    if (trades && trades.length > 0) {
      return trades.map((trade: SwapInfo) => <TradeItem key={trade.id} trade={trade} />)
    }

    return null
  }

  return (
    <Container>
      <WidgetHeader>Market Trades</WidgetHeader>
      <Content>{renderTrades()}</Content>
    </Container>
  )
}

export default MarketTrades
