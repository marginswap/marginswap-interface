import React from 'react'
import { ChainId } from '@marginswap/sdk'

import { useActiveWeb3React } from 'hooks'
import { ApplicationModal } from '../../state/application/actions'
import { useModalOpen, useNetworkModalToggle } from '../../state/application/hooks'
import { NETWORK_ICON, NETWORK_LABEL } from '../../constants/networks'
import Modal from '../Modal'
import { PARAMS } from './utils'

import {
  Wrapper,
  HeaderRow,
  ContentWrapper,
  NetworkContainer,
  NetworkDescription,
  NetworkImg,
  NetworkOption
} from './styled'

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
          {[ChainId.MAINNET, ChainId.AVALANCHE, ChainId.MATIC, ChainId.BSC].map((key: ChainId, i: number) => {
            if (chainId === key) return null
            return (
              <NetworkOption
                key={i}
                onClick={() => {
                  toggleNetworkModal()
                  const params = PARAMS[key]
                  library?.send('wallet_addEthereumChain', [params, account]).then(() => location.reload())
                }}
              >
                <NetworkContainer>
                  <NetworkImg src={NETWORK_ICON[key]} alt="Switch Network" />
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
