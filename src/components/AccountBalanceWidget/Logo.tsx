import React from 'react'
import { Currency } from '@marginswap/sdk'
import CurrencyLogo from '../CurrencyLogo'
import { useCurrency } from '../../hooks/Tokens'

const Logo = ({ address }: { address: string }) => {
  const currency = useCurrency(address) || Currency.ETHER
  return <CurrencyLogo currency={currency} size={'14px'} style={{ marginRight: '5px' }} />
}

export default Logo
