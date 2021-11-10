import { StyledBalanceMaxMini } from 'components/swap/styleds'
import React, { useState } from 'react'
import { Repeat } from 'react-feather'
import styled from 'styled-components'
import { SwapInfo } from 'types'
import FormatTradePrice from './FormatTradePrice'
import { DateTime } from 'luxon'
import { getPegCurrency, USDT_MAINNET } from '../../constants'
import { formatUnits } from '@ethersproject/units'
import { ETHER, Token } from '@marginswap/sdk'
import { useActiveWeb3React } from 'hooks'

const Container = styled.div`
  padding: 0;
  list-style-type: none;
  width: 100%;
  border-bottom: 1px solid #3d3d3d;
`

const Row = styled.li`
  display: flex;
  justify-content: flex-end;
  padding: 0.3em;
  font-size: 0.8em;

  > label {
    padding: 0 0 0 0.5em;
    flex: 1;
  }

  > div {
    display: flex;
    flex: 2;
    overflow-x: hidden;
    line-height: 1.4;

    > button {
      margin-left: 0;
      margin-right: 4px;
      height: 18px;
      width: 18px;
      background-color: #64676c;
    }
  }
`

const TradeItem = ({ trade }: { trade: SwapInfo }) => {
  const { chainId } = useActiveWeb3React()
  const [showInverted, setShowInverted] = useState<boolean>(false)

  const renderSize = () => {
    const pegCurrency = getPegCurrency(chainId) ?? (USDT_MAINNET as Token)
    let size

    if (pegCurrency.address === trade.fromToken) {
      size = formatUnits(trade.toAmount, ETHER.decimals)
    }

    size = formatUnits(trade.fromAmount, ETHER.decimals)
    return <span title={size}>{size}</span>
  }

  return (
    <Container>
      <Row>
        <label>Size</label>
        <div>{renderSize()}</div>
      </Row>
      <Row>
        <label>Price</label>
        <div>
          <StyledBalanceMaxMini title="Switch" onClick={() => setShowInverted(!showInverted)}>
            <Repeat size={12} />
          </StyledBalanceMaxMini>
          <FormatTradePrice swap={trade} invert={showInverted} />
        </div>
      </Row>
      <Row>
        <label>Date</label>
        <div>{DateTime.fromMillis(+trade.createdAt * 1000).toLocaleString(DateTime.DATETIME_SHORT)}</div>
      </Row>
    </Container>
  )
}

export default TradeItem
