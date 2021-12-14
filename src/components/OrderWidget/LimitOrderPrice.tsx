import { Currency } from '@marginswap/sdk'
import React from 'react'
import { useContext } from 'react'
import { Text } from 'rebass'
import { ThemeContext } from 'styled-components'

interface LimitOrderPriceProps {
  amount: string
  price: string
  currency?: Currency
}

export default function LimitOrderPrice({ amount, price, currency }: LimitOrderPriceProps) {
  const theme = useContext(ThemeContext)

  const formattedPrice = (parseFloat(price) * parseFloat(amount)).toFixed(2)

  const show = amount && price
  const label = `${currency?.symbol}`

  return (
    <Text
      fontWeight={500}
      fontSize={14}
      color={theme.text2}
      style={{ justifyContent: 'center', alignItems: 'center', display: 'flex' }}
    >
      {show ? (
        <>
          {formattedPrice ?? '-'} {label}
        </>
      ) : (
        '-'
      )}
    </Text>
  )
}
