import React from 'react'
import { ChainId } from '@marginswap/sdk'
import styled from 'styled-components'
import { useActiveWeb3React } from 'hooks'
import { ApplicationModal } from '../../state/application/actions'
import { useModalOpen, useNetworkModalToggle } from '../../state/application/hooks'
import { NETWORK_ICON, NETWORK_LABEL } from '../../constants/networks'
import { ButtonSecondary } from '../Button'
import Modal from '../Modal'

const PARAMS: {
  [chainId in ChainId]?: {
    chainId: string
    chainName: string
    nativeCurrency: {
      name: string
      symbol: string
      decimals: number
    }
    rpcUrls: string[]
    blockExplorerUrls: string[]
  }
} = {
  [ChainId.MAINNET]: {
    chainId: '0x1',
    chainName: 'Ethereum',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18
    },
    rpcUrls: ['https://mainnet.infura.io/v3'],
    blockExplorerUrls: ['https://etherscan.com']
  },
  /*[ChainId.ROPSTEN]: {
    chainId: '0x3',
    chainName: 'Ropsten',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18
    },
    rpcUrls: ['https://mainnet.infura.io/v3'],
    blockExplorerUrls: ['https://etherscan.com']
  },
  [ChainId.RINKEBY]: {
    chainId: '0x4',
    chainName: 'Rinkeby',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18
    },
    rpcUrls: ['https://mainnet.infura.io/v3'],
    blockExplorerUrls: ['https://etherscan.com']
  },
  [ChainId.GÖRLI]: {
    chainId: '0x5',
    chainName: 'Goerli',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18
    },
    rpcUrls: ['https://mainnet.infura.io/v3'],
    blockExplorerUrls: ['https://etherscan.com']
  },
  [ChainId.KOVAN]: {
    chainId: '0x2a',
    chainName: 'Kovan',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18
    },
    rpcUrls: ['https://mainnet.infura.io/v3'],
    blockExplorerUrls: ['https://etherscan.com']
  },*/
  [ChainId.FANTOM]: {
    chainId: '0xfa',
    chainName: 'Fantom',
    nativeCurrency: {
      name: 'Fantom',
      symbol: 'FTM',
      decimals: 18
    },
    rpcUrls: ['https://rpcapi.fantom.network'],
    blockExplorerUrls: ['https://ftmscan.com']
  },
  [ChainId.AVALANCHE]: {
    chainId: '43114',
    chainName: 'Avalanche',
    nativeCurrency: {
      name: 'Avalanche',
      symbol: 'AVAX',
      decimals: 18
    },
    rpcUrls: ['https://rpcapi.fantom.network'],
    blockExplorerUrls: ['https://ftmscan.com']
  },
  [ChainId.BSC]: {
    chainId: '0x38',
    chainName: 'Binance Smart Chain',
    nativeCurrency: {
      name: 'Binance Coin',
      symbol: 'BNB',
      decimals: 18
    },
    rpcUrls: ['https://bsc-dataseed.binance.org'],
    blockExplorerUrls: ['https://bscscan.com']
  },
  [ChainId.MATIC]: {
    chainId: '0x89',
    chainName: 'Matic',
    nativeCurrency: {
      name: 'Matic',
      symbol: 'MATIC',
      decimals: 18
    },
    rpcUrls: ['https://rpc-mainnet.maticvigil.com'],
    blockExplorerUrls: ['https://explorer-mainnet.maticvigil.com']
  },
  [ChainId.HECO]: {
    chainId: '0x80',
    chainName: 'Heco',
    nativeCurrency: {
      name: 'Heco Token',
      symbol: 'HT',
      decimals: 18
    },
    rpcUrls: ['https://http-mainnet.hecochain.com'],
    blockExplorerUrls: ['https://hecoinfo.com']
  },
  [ChainId.XDAI]: {
    chainId: '0x64',
    chainName: 'xDai',
    nativeCurrency: {
      name: 'xDai Token',
      symbol: 'xDai',
      decimals: 18
    },
    rpcUrls: ['https://rpc.xdaichain.com'],
    blockExplorerUrls: ['https://blockscout.com/poa/xdai']
  },
  [ChainId.HARMONY]: {
    chainId: '0x63564C40',
    chainName: 'Harmony One',
    nativeCurrency: {
      name: 'One Token',
      symbol: 'ONE',
      decimals: 18
    },
    rpcUrls: ['https://api.s0.t.hmny.io'],
    blockExplorerUrls: ['https://explorer.harmony.one/']
  }
}

const Wrapper = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap}
  margin: 0;
  padding: 1em;
  width: 100%;
`
const HeaderRow = styled.div`
  padding: 1rem 1rem;
  font-weight: 500;
  color: ${props => (props.color === 'blue' ? ({ theme }) => theme.primary1 : 'inherit')};
  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding: 1rem;
  `};
  .colored-text-blue4 {
    font-weight: 500;
    color: ${({ theme }) => theme.blue4};
    text-transform: uppercase;
  }
  .colored-text-primary1 {
    font-weight: 500;
    color: ${({ theme }) => theme.primary1};
  }
`
const ContentWrapper = styled.div`
  padding: 0.5rem;

  ${({ theme }) => theme.mediaWidth.upToMedium`padding: 1rem`};
`

const NetworkContainer = styled.div`
  display: flex;
  align-items: center;
  border-radius: 5px;
  cursor: pointer;
`

const NetworkDescription = styled.div`
  font-weight: 500;
  border-radius: 12px;
  color: ${({ theme }) => theme.white};
`

const NetworkImg = styled.img`
  border-radius: 25px;
  margin-right: 5px;
  margin-left: 10px;
`
const NetworkOption = styled(ButtonSecondary)`
  justify-content: flex-start;
  margin: 1em 0;

  .active {
    border: 1px solid ${({ theme }) => theme.primary3};
  }
`

export default function NetworkModal(): JSX.Element | null {
  const { chainId, library, account } = useActiveWeb3React()
  const networkModalOpen = useModalOpen(ApplicationModal.NETWORK)
  const toggleNetworkModal = useNetworkModalToggle()

  if (!chainId) return null

  return (
    <Modal isOpen={networkModalOpen} onDismiss={toggleNetworkModal}>
      <Wrapper>
        <HeaderRow>
          Select a Network <br />
          <br />
          You are currently browsing <span className="colored-text-blue4">MarginSwap</span>
          <br /> on the <span className="colored-text-primary1">{NETWORK_LABEL[chainId]}</span> network
        </HeaderRow>

        <ContentWrapper>
          {[
            ChainId.MAINNET,
            /*ChainId.ROPSTEN,
            ChainId.RINKEBY,
            ChainId.GÖRLI,
            ChainId.KOVAN,
            ChainId.FANTOM,*/
            ChainId.AVALANCHE,
            ChainId.BSC
            /*ChainId.MATIC,
            ChainId.HECO,
            ChainId.XDAI,
            ChainId.HARMONY*/
          ].map((key: ChainId, i: number) => {
            if (chainId === key) return null
            return (
              <NetworkOption
                key={i}
                onClick={() => {
                  toggleNetworkModal()
                  const params = PARAMS[key]
                  console.log({ params })
                  library?.send('wallet_addEthereumChain', [params, account])
                }}
              >
                <NetworkContainer>
                  <NetworkImg src={NETWORK_ICON[key]} alt="Switch Network" style={{ width: 32, height: 32 }} />
                  <NetworkDescription>{NETWORK_LABEL[key]}</NetworkDescription>
                </NetworkContainer>
              </NetworkOption>
            )
          })}
        </ContentWrapper>
      </Wrapper>
    </Modal>
  )
}
