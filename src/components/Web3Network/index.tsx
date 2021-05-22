import React from 'react'
import styled from 'styled-components'
import { useActiveWeb3React } from 'hooks'
import { ButtonSecondary } from '../Button'
import { useNetworkModalToggle } from '../../state/application/hooks'
import { NETWORK_ICON, NETWORK_LABEL } from '../../constants/networks'
import NetworkModel from '../NetworkModal'

const NetworkContainer = styled.div`
  display: flex;
  align-items: center;
  border-radius: 5px;
  cursor: pointer;
`

const NetworkDescription = styled(ButtonSecondary)`
  font-weight: 500;
  background-color: #373b44;
  padding: 0.5em;
  border-radius: 12px;
  color: ${({ theme }) => theme.white};
`

const NetworkImg = styled.img`
  border-radius: 25px;
  margin-right: 5px;
  margin-left: 10px;
`

function Web3Network(): JSX.Element | null {
  const { chainId } = useActiveWeb3React()

  const toggleNetworkModal = useNetworkModalToggle()

  if (!chainId) return null

  return (
    <>
      <NetworkContainer onClick={() => toggleNetworkModal()}>
        <NetworkImg src={NETWORK_ICON[chainId]} alt="Switch Network" style={{ width: 22, height: 22 }} />
        <NetworkDescription>{NETWORK_LABEL[chainId]}</NetworkDescription>
      </NetworkContainer>
      <NetworkModel />
    </>
  )
}

export default Web3Network
