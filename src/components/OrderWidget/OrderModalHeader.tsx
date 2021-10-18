import React, { useContext } from 'react'
import { Currency } from '@marginswap/sdk'
import { ArrowDown } from 'react-feather'
import { Text } from 'rebass'
import styled, { ThemeContext } from 'styled-components'
import { AutoColumn } from '../Column'
import CurrencyLogo from '../CurrencyLogo'
import { RowBetween, RowFixed } from '../Row'

export const TruncatedText = styled(Text)`
  text-overflow: ellipsis;
  width: 220px;
  overflow: hidden;
`

const OrderModalHeader = ({
  fromToken,
  toToken,
  inAmount,
  outAmount
}: {
  fromToken: Currency
  toToken: Currency
  inAmount: string
  outAmount: string
}) => {
  const theme = useContext(ThemeContext)

  return (
    <AutoColumn gap={'md'} style={{ marginTop: '20px' }}>
      <RowBetween align="flex-end">
        <RowFixed gap={'0px'}>
          <CurrencyLogo currency={fromToken} size={'24px'} style={{ marginRight: '12px' }} />
          <TruncatedText fontSize={24} fontWeight={500} color={theme.primary1}>
            {inAmount}
          </TruncatedText>
        </RowFixed>
        <RowFixed gap={'0px'}>
          <Text fontSize={24} fontWeight={500} style={{ marginLeft: '10px' }}>
            {fromToken.symbol}
          </Text>
        </RowFixed>
      </RowBetween>
      <RowFixed>
        <ArrowDown size="16" color={theme.text2} style={{ marginLeft: '4px', minWidth: '16px' }} />
      </RowFixed>
      <RowBetween align="flex-end">
        <RowFixed gap={'0px'}>
          <CurrencyLogo currency={toToken} size={'24px'} style={{ marginRight: '12px' }} />
          <TruncatedText fontSize={24} fontWeight={500} color={theme.primary1}>
            {outAmount}
          </TruncatedText>
        </RowFixed>
        <RowFixed gap={'0px'}>
          <Text fontSize={24} fontWeight={500} style={{ marginLeft: '10px' }}>
            {toToken.symbol}
          </Text>
        </RowFixed>
      </RowBetween>
    </AutoColumn>
  )
}

export default OrderModalHeader
