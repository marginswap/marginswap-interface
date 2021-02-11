export interface ExchangePrice {
  exchange: string
  price: number
  gasFees: number
}

export const exchanges: ExchangePrice[] = [
  {
    exchange: 'SushiSwap',
    price: 1358.70043,
    gasFees: 14
  },
  {
    exchange: 'ParaSwap Pool',
    price: 1435.60043,
    gasFees: 22
  },
  {
    exchange: 'Kyber',
    price: 1322.48012,
    gasFees: 68
  },
  {
    exchange: 'Shinobi',
    price: 1238.874012,
    gasFees: 61
  },
  {
    exchange: 'Opporo Chanchai',
    price: 1322.38012,
    gasFees: 37
  },
  {
    exchange: 'Lumin',
    price: 1382.18012,
    gasFees: 48
  },
  {
    exchange: 'Optor Woptor',
    price: 1722.42012,
    gasFees: 54
  }
]
