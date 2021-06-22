import { ChainId } from '@marginswap/sdk'

//import Arbitrum from '../assets/networks/arbitrum-network.jpg'
//import Avalanche from '../assets/networks/avalanche-network.jpg'
import Bsc from '../assets/networks/bsc-network.jpg'
import Fantom from '../assets/networks/fantom-network.jpg'
import Avalanche from '../assets/networks/avalanche-network.png'
import Goerli from '../assets/networks/goerli-network.jpg'
import Harmony from '../assets/networks/harmonyone-network.jpg'
import Heco from '../assets/networks/heco-network.jpg'
import Kovan from '../assets/networks/kovan-network.jpg'
//import Matic from '../assets/networks/matic-network.jpg'
//import Moonbeam from '../assets/networks/moonbeam-network.jpg'
import Polygon from '../assets/networks/polygon-network.png'
import Rinkeby from '../assets/networks/rinkeby-network.jpg'
import Ropsten from '../assets/networks/ropsten-network.jpg'
import Xdai from '../assets/networks/xdai-network.jpg'
import Mainnet from '../assets/networks/mainnet-network.jpg'

export const NETWORK_URLS: { [key: number]: string } = {
  1: 'https://mainnet.infura.io/v3/ae52aea5aa2b41e287d72e10b1175491',
  42: 'https://kovan.infura.io/v3/ae52aea5aa2b41e287d72e10b1175491',
  43114: 'https://api.avax.network/ext/bc/C/rpc',
  31337: 'http://localhost:8545',
  137: 'https://rpc-mainnet.maticvigil.com/v1/b0858bc7aa27b1333df19546c12718235bd11785'
}

export const NETWORK_ICON = {
  [ChainId.MAINNET]: Mainnet,
  [ChainId.ROPSTEN]: Ropsten,
  [ChainId.RINKEBY]: Rinkeby,
  [ChainId.GÖRLI]: Goerli,
  [ChainId.KOVAN]: Kovan,
  [ChainId.FANTOM]: Fantom,
  [ChainId.AVALANCHE]: Avalanche,
  [ChainId.BSC]: Bsc,
  [ChainId.MATIC]: Polygon,
  [ChainId.XDAI]: Xdai,
  [ChainId.HECO]: Heco,
  [ChainId.HARMONY]: Harmony,
  [ChainId.LOCAL]: Harmony,
  [ChainId.FUJI]: Avalanche
}

export const NETWORK_LABEL: { [chainId in ChainId]?: string } = {
  [ChainId.MAINNET]: 'Ethereum',
  [ChainId.RINKEBY]: 'Rinkeby',
  [ChainId.ROPSTEN]: 'Ropsten',
  [ChainId.GÖRLI]: 'Görli',
  [ChainId.KOVAN]: 'Kovan',
  [ChainId.FANTOM]: 'Fantom',
  [ChainId.AVALANCHE]: 'Avalanche',
  [ChainId.MATIC]: 'Polygon (Matic)',
  [ChainId.XDAI]: 'xDai',
  [ChainId.BSC]: 'BSC',
  [ChainId.HECO]: 'HECO',
  [ChainId.HARMONY]: 'Harmony',
  [ChainId.LOCAL]: 'Local Testnet'
}
