import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { WalletLinkConnector } from '@web3-react/walletlink-connector'
import { PortisConnector } from '@web3-react/portis-connector'

import { FortmaticConnector } from './Fortmatic'
import { NetworkConnector } from './NetworkConnector'

const NETWORK_URL = process.env.REACT_APP_NETWORK_URL
const FORMATIC_KEY = process.env.REACT_APP_FORTMATIC_KEY
const PORTIS_ID = process.env.REACT_APP_PORTIS_ID

export const NETWORK_CHAIN_ID: number = parseInt(process.env.REACT_APP_CHAIN_ID ?? '1')

if (typeof NETWORK_URL === 'undefined') {
  throw new Error(`REACT_APP_NETWORK_URL must be a defined environment variable`)
}

export const network = new NetworkConnector({
  urls: {
    // [NETWORK_CHAIN_ID]: NETWORK_URL,
    1: 'https://eth-mainnet.alchemyapi.io/v2/AcIJPH41nagmF3o1sPArEns8erN9N691',
    // 42: 'https://kovan.infura.io/v3/ae52aea5aa2b41e287d72e10b1175491',
    43114: 'https://api.avax.network/ext/bc/C/rpc'
    // 31337: 'http://localhost:8545',
    // 137: 'https://rpc-mainnet.maticvigil.com/v1/b0858bc7aa27b1333df19546c12718235bd11785',
    // 56: 'https://bsc-dataseed.binance.org/'
  },
  defaultChainId: 1
})

// let networkLibrary: Web3Provider | undefined
// export function getNetworkLibrary(): Web3Provider {
//   return (networkLibrary = networkLibrary ?? new Web3Provider(network.provider as any))
// }

export const injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42, 43114, 31337, 137, 56]
})

// mainnet only
export const walletconnect = new WalletConnectConnector({
  rpc: { 1: NETWORK_URL },
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true,
  pollingInterval: 15000
})

// mainnet only
export const fortmatic = new FortmaticConnector({
  apiKey: FORMATIC_KEY ?? '',
  chainId: 1
})

// mainnet only
export const portis = new PortisConnector({
  dAppId: PORTIS_ID ?? '',
  networks: [1]
})

// mainnet only
export const walletlink = new WalletLinkConnector({
  url: NETWORK_URL,
  appName: 'Uniswap',
  appLogoUrl:
    'https://mpng.pngfly.com/20181202/bex/kisspng-emoji-domain-unicorn-pin-badges-sticker-unicorn-tumblr-emoji-unicorn-iphoneemoji-5c046729264a77.5671679315437924251569.jpg'
})
