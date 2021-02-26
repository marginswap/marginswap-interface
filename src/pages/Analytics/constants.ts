export interface WalletInfo {
  exchange: string
  price: number | null
  gasFees: number
}

export const wallets: WalletInfo[] = [
  {
    exchange: 'Ether (Wrapped)',
    price: null,
    gasFees: 1445631
  },
  {
    exchange: 'USD//C',
    price: null,
    gasFees: 224243
  },
  {
    exchange: 'BTC',
    price: null,
    gasFees: 6842787
  },
  {
    exchange: 'DogeCoin',
    price: null,
    gasFees: 613446
  },
  {
    exchange: 'Litecoin',
    price: null,
    gasFees: 374215
  },
  {
    exchange: 'Bitcoin Cash',
    price: null,
    gasFees: 48428
  },
  {
    exchange: 'Chainlink',
    price: null,
    gasFees: 5442
  }
]
