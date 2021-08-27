import { Contract } from '@ethersproject/contracts'
import { getAddress } from '@ethersproject/address'
import { AddressZero } from '@ethersproject/constants'
import { JsonRpcSigner, Web3Provider } from '@ethersproject/providers'
import { BigNumber } from '@ethersproject/bignumber'
import { TokenInfo } from '@uniswap/token-lists'
import { ChainId, JSBI, Percent, Token, CurrencyAmount, Currency, ETHER, getAddresses } from '@marginswap/sdk'
import MarginRouter from '@marginswap/core-abi/artifacts/contracts/MarginRouter.sol/MarginRouter.json'
import SpotRouter from '@marginswap/core-abi/artifacts/contracts/SpotRouter.sol/SpotRouter.json'
import Staking from '@marginswap/core-abi/artifacts/contracts/Staking.sol/Staking.json'
import MFIStaking from '@marginswap/core-abi/artifacts/contracts/MFIStaking.sol/MFIStaking.json'
import LiquidityStaking from '@marginswap/core-abi/artifacts/contracts/LiquidityMiningReward.sol/LiquidityMiningReward.json'

import { TokenAddressMap } from '../state/lists/hooks'

export interface TokenInfoWithCoingeckoId extends TokenInfo {
  coingeckoId?: string
}

// returns the checksummed address if the address is valid, otherwise returns false
export function isAddress(value: any): string | false {
  try {
    return getAddress(value)
  } catch {
    return false
  }
}

// const ETHERSCAN_PREFIXES: { [chainId in ChainId]: string } = {
//   1: '',
//   3: 'ropsten.',
//   4: 'rinkeby.',
//   5: 'goerli.',
//   42: 'kovan.',
//   137: 'matic.',
//   100: 'xDai.',
//   128: 'heco.',
//   1666600000: 'harmony.',
//   250: 'fantom.',
//   43114: 'Avalanche.',
//   56: 'binance.',
//   31337: ''
// }

// Multichain Explorer
const builders = {
  etherscan: (chainName: string, data: string, type: 'transaction' | 'token' | 'address' | 'block') => {
    const prefix = `https://${chainName ? `${chainName}.` : ''}etherscan.io`
    switch (type) {
      case 'transaction':
        return `${prefix}/tx/${data}`
      default:
        return `${prefix}/${type}/${data}`
    }
  },
  polygonscan: (_: string, data: string, type: 'transaction' | 'token' | 'address' | 'block') => {
    const prefix = `https://polygonscan.com`
    switch (type) {
      case 'transaction':
        return `${prefix}/tx/${data}`
      default:
        return `${prefix}/${type}/${data}`
    }
  },
  fantom: (_: string, data: string, type: 'transaction' | 'token' | 'address' | 'block') => {
    const prefix = 'https://ftmscan.com'
    switch (type) {
      case 'transaction':
        return `${prefix}/tx/${data}`
      default:
        return `${prefix}/${type}/${data}`
    }
  },

  xdai: (_: string, data: string, type: 'transaction' | 'token' | 'address' | 'block') => {
    const prefix = `https://blockscout.com/poa/xdai`
    switch (type) {
      case 'transaction':
        return `${prefix}/tx/${data}`
      case 'token':
        return `${prefix}/tokens/${data}`
      default:
        return `${prefix}/${type}/${data}`
    }
  },

  bscscan: (chainName: string, data: string, type: 'transaction' | 'token' | 'address' | 'block') => {
    const prefix = `https://${chainName ? `${chainName}.` : ''}bscscan.com`
    switch (type) {
      case 'transaction':
        return `${prefix}/tx/${data}`
      default:
        return `${prefix}/${type}/${data}`
    }
  },

  matic: (chainName: string, data: string, type: 'transaction' | 'token' | 'address' | 'block') => {
    const prefix = `https://explorer-${chainName}.maticvigil.com`
    switch (type) {
      case 'transaction':
        return `${prefix}/tx/${data}`
      case 'token':
        return `${prefix}/tokens/${data}`
      default:
        return `${prefix}/${type}/${data}`
    }
  },

  // token is not yet supported for arbitrum
  arbitrum: (_: string, data: string, type: 'transaction' | 'token' | 'address' | 'block') => {
    const prefix = `https://explorer.offchainlabs.com/#`
    switch (type) {
      case 'transaction':
        return `${prefix}/tx/${data}`
      case 'token':
        return prefix
      default:
        return `${prefix}/${type}/${data}`
    }
  },
  moonbase: (_: string, data: string, type: 'transaction' | 'token' | 'address' | 'block') => {
    const prefix = 'https://moonbeam-explorer.netlify.app'
    switch (type) {
      case 'transaction':
        return `${prefix}/tx/${data}`
      case 'address':
        return `${prefix}/address/${data}`
      default:
        return `${prefix}/${type}/${data}`
    }
  },

  avalanche: (chainName: string, data: string, type: 'transaction' | 'token' | 'address' | 'block') => {
    const prefix = `https://cchain.explorer.avax${chainName ? `-${chainName}` : ''}.network`
    switch (type) {
      case 'transaction':
        return `${prefix}/tx/${data}`
      default:
        return `${prefix}/${type}/${data}`
    }
  },

  heco: (chainName = '', data: string, type: 'transaction' | 'token' | 'address' | 'block') => {
    const prefix = `https://${chainName ? `${chainName}.` : ''}hecoinfo.com`
    switch (type) {
      case 'transaction':
        return `${prefix}/tx/${data}`
      default:
        return `${prefix}/${type}/${data}`
    }
  },

  harmony: (_: string, data: string, type: 'transaction' | 'token' | 'address' | 'block') => {
    const prefix = 'https://explorer.harmony.one/#'
    switch (type) {
      case 'transaction':
        return `${prefix}/tx/${data}`
      default:
        return `${prefix}/${type}/${data}`
    }
  },

  harmonyTestnet: (_: string, data: string, type: 'transaction' | 'token' | 'address' | 'block') => {
    const prefix = 'https://explorer.pops.one/#'
    switch (type) {
      case 'transaction':
        return `${prefix}/tx/${data}`
      default:
        return `${prefix}/${type}/${data}`
    }
  },
  okex: (_: string, data: string, type: 'transaction' | 'token' | 'address' | 'block') => {
    const prefix = 'https://www.oklink.com/okexchain'
    switch (type) {
      case 'transaction':
        return `${prefix}/tx/${data}`
      case 'token':
        return `${prefix}/tokenAddr/${data}`
      default:
        return `${prefix}/${type}/${data}`
    }
  },
  okexTestnet: (_: string, data: string, type: 'transaction' | 'token' | 'address' | 'block') => {
    const prefix = 'https://www.oklink.com/okexchain-test'
    switch (type) {
      case 'transaction':
        return `${prefix}/tx/${data}`
      case 'token':
        return `${prefix}/tokenAddr/${data}`
      default:
        return `${prefix}/${type}/${data}`
    }
  }
}

export function getExplorerLink(
  chainId: ChainId,
  data: string,
  type: 'transaction' | 'token' | 'address' | 'block'
): string {
  const chain = chains[chainId]
  return chain.builder(chain.chainName, data, type)
}

interface ChainObject {
  [chainId: number]: {
    chainName: string
    builder: (chainName: string, data: string, type: 'transaction' | 'token' | 'address' | 'block') => string
  }
}

const chains: ChainObject = {
  [ChainId.LOCAL]: {
    chainName: '',
    builder: builders.etherscan
  },
  [ChainId.MAINNET]: {
    chainName: '',
    builder: builders.etherscan
  },
  [ChainId.ROPSTEN]: {
    chainName: 'ropsten',
    builder: builders.etherscan
  },
  [ChainId.RINKEBY]: {
    chainName: 'rinkeby',
    builder: builders.etherscan
  },
  [ChainId.GÖRLI]: {
    chainName: 'goerli',
    builder: builders.etherscan
  },
  [ChainId.KOVAN]: {
    chainName: 'kovan',
    builder: builders.etherscan
  },
  [ChainId.MATIC]: {
    chainName: 'mainnet',
    builder: builders.polygonscan
  },
  // [ChainId.MATIC]: {
  //   chainName: 'mainnet',
  //   builder: builders.matic
  // },
  // [ChainId.MATIC_TESTNET]: {
  //     chainName: 'mumbai',
  //     builder: builders.matic
  // },
  // [ChainId.FANTOM]: {
  //     chainName: '',
  //     builder: builders.fantom
  // },
  // [ChainId.FANTOM_TESTNET]: {
  //     chainName: 'testnet',
  //     builder: builders.fantom
  // },
  // [ChainId.XDAI]: {
  //     chainName: 'xdai',
  //     builder: builders.xdai
  // },
  [ChainId.BSC]: {
    chainName: '',
    builder: builders.bscscan
  },
  // [ChainId.BSC_TESTNET]: {
  //     chainName: 'testnet',
  //     builder: builders.bscscan
  // },
  // [ChainId.ARBITRUM]: {
  //     chainName: 'arbitrum',
  //     builder: builders.arbitrum
  // },
  // [ChainId.MOONBASE]: {
  //     chainName: '',
  //     builder: builders.moonbase
  // },
  [ChainId.AVALANCHE]: {
    chainName: '',
    builder: builders.avalanche
  },
  [ChainId.FUJI]: {
    chainName: 'test',
    builder: builders.avalanche
  }
  // [ChainId.HECO]: {
  //     chainName: '',
  //     builder: builders.heco
  // },
  // [ChainId.HECO_TESTNET]: {
  //     chainName: 'testnet',
  //     builder: builders.heco
  // },
  // [ChainId.HARMONY]: {
  //     chainName: '',
  //     builder: builders.harmony
  // },
  // [ChainId.HARMONY_TESTNET]: {
  //     chainName: '',
  //     builder: builders.harmonyTestnet
  // },
  // [ChainId.OKEX]: {
  //     chainName: '',
  //     builder: builders.okex
  // },
  // [ChainId.OKEX_TESTNET]: {
  //     chainName: '',
  //     builder: builders.okexTestnet
  // }
}

// shorten the checksummed version of the input address to have 0x + 4 characters at start and end
export function shortenAddress(address: string, chars = 4): string {
  const parsed = isAddress(address)
  if (!parsed) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }
  return `${parsed.substring(0, chars + 2)}...${parsed.substring(42 - chars)}`
}

// add 10%
export function calculateGasMargin(value: BigNumber): BigNumber {
  return value.mul(BigNumber.from(10000).add(BigNumber.from(1000))).div(BigNumber.from(10000))
}

// converts a basis points value to a sdk percent
export function basisPointsToPercent(num: number): Percent {
  return new Percent(JSBI.BigInt(num), JSBI.BigInt(10000))
}

export function calculateSlippageAmount(value: CurrencyAmount, slippage: number): [JSBI, JSBI] {
  if (slippage < 0 || slippage > 10000) {
    throw Error(`Unexpected slippage value: ${slippage}`)
  }
  return [
    JSBI.divide(JSBI.multiply(value.raw, JSBI.BigInt(10000 - slippage)), JSBI.BigInt(10000)),
    JSBI.divide(JSBI.multiply(value.raw, JSBI.BigInt(10000 + slippage)), JSBI.BigInt(10000))
  ]
}

// account is not optional
export function getSigner(library: Web3Provider, account: string): JsonRpcSigner {
  return library.getSigner(account).connectUnchecked()
}

// account is optional
export function getProviderOrSigner(library: Web3Provider, account?: string): Web3Provider | JsonRpcSigner {
  return account ? getSigner(library, account) : library
}

// account is optional
export function getContract(address: string, ABI: any, library: Web3Provider, account?: string): Contract {
  if (!isAddress(address) || address === AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }

  return new Contract(address, ABI, getProviderOrSigner(library, account) as any)
}

export function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
}

export function isTokenOnList(defaultTokens: TokenAddressMap, currency?: Currency): boolean {
  if (currency === ETHER) return true
  return Boolean(currency instanceof Token && defaultTokens[currency.chainId]?.[currency.address])
}

// account is optional
export function getSpotRouterContract(chainId: ChainId, library: Web3Provider, account?: string): Contract {
  return getContract(getAddresses(chainId).SpotRouter, SpotRouter.abi, library, account)
}

// account is optional
export function getMarginRouterContract(chainId: ChainId, library: Web3Provider, account?: string): Contract {
  return getContract(getAddresses(chainId).MarginRouter, MarginRouter.abi, library, account)
}

// account is optional
export function getMFIStakingContract(
  chainId: ChainId | undefined,
  library: Web3Provider | undefined,
  account: string | undefined
): Contract | undefined {
  if (!chainId || !library || !account) return undefined
  return getContract(getAddresses(chainId).Staking, Staking.abi, library, account)
}

// account is optional
export function getLiquidityStakingContract(
  chainId: ChainId | undefined,
  library: Web3Provider | undefined,
  account: string | undefined
): Contract | undefined {
  if (!chainId || !library || !account) return undefined
  return getContract(getAddresses(chainId).LiquidityMiningReward, LiquidityStaking.abi, library, account)
}

export function getLegacyStakingContract(
  chainId: ChainId | undefined,
  library: Web3Provider | undefined,
  account: string | undefined
): Contract | undefined {
  if (!chainId || !library || !account) return undefined
  return getContract(getAddresses(chainId).MFIStaking, MFIStaking.abi, library, account)
}
