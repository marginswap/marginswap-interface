import React, { FunctionComponent, useContext, useRef, useState } from 'react'
import { Text } from 'rebass'
import { ThemeContext } from 'styled-components'
import { useOnClickOutside } from '../../hooks/useOnClickOutside'
import { TYPE } from '../../theme'
import { ButtonError } from '../Button'
import { AutoColumn } from '../Column'
import Modal from '../Modal'
import QuestionHelper from '../QuestionHelper'
import { RowBetween, RowFixed } from '../Row'
import Toggle from '../Toggle'
import TransactionSettings from '../TransactionSettings'
import {
  Break,
  EmojiWrapper,
  MenuFlyout,
  ModalContentWrapper,
  StyledCloseIcon,
  StyledMenu,
  StyledMenuButton,
  StyledMenuIcon
} from './styled'

const SwapSettings: FunctionComponent<{
  isOpened: boolean
  toggleOpened: () => void
  expertMode: boolean
  toggleExpertMode: () => void
  slippageTolerance: number
  setSlippageTolerance: (tolerance: number) => void
  deadline: number
  setDeadline: (deadline: number) => void
  singleHopOnly: boolean
  setSingleHopOnly: (single: boolean) => void
}> = ({
  isOpened,
  toggleOpened,
  expertMode,
  toggleExpertMode,
  slippageTolerance,
  setSlippageTolerance,
  deadline,
  setDeadline,
  singleHopOnly,
  setSingleHopOnly
}) => {
  const node = useRef<HTMLDivElement>(null)
  const theme = useContext(ThemeContext)
  const [showConfirmation, setShowConfirmation] = useState(false)
  useOnClickOutside(node, isOpened ? toggleOpened : undefined)

  return (
    <StyledMenu ref={node}>
      <Modal isOpen={showConfirmation} onDismiss={() => setShowConfirmation(false)} maxHeight={100}>
        <ModalContentWrapper>
          <AutoColumn gap="lg">
            <RowBetween style={{ padding: '0 2rem' }}>
              <div />
              <Text fontWeight={500} fontSize={20}>
                Are you sure?
              </Text>
              <StyledCloseIcon onClick={() => setShowConfirmation(false)} />
            </RowBetween>
            <Break />
            <AutoColumn gap="lg" style={{ padding: '0 2rem' }}>
              <Text fontWeight={500} fontSize={20}>
                Expert mode turns off the confirm transaction prompt and allows high slippage trades that often result
                in bad rates and lost funds.
              </Text>
              <Text fontWeight={600} fontSize={20}>
                ONLY USE THIS MODE IF YOU KNOW WHAT YOU ARE DOING.
              </Text>
              <ButtonError
                error={true}
                padding={'12px'}
                onClick={() => {
                  toggleExpertMode()
                  setShowConfirmation(false)
                }}
              >
                <Text fontSize={20} fontWeight={500} id="confirm-expert-mode">
                  Turn On Expert Mode
                </Text>
              </ButtonError>
            </AutoColumn>
          </AutoColumn>
        </ModalContentWrapper>
      </Modal>
      <StyledMenuButton onClick={toggleOpened} id="open-settings-dialog-button">
        <StyledMenuIcon />
        {expertMode ? (
          <EmojiWrapper>
            <span role="img" aria-label="wizard-icon">
              🧙
            </span>
          </EmojiWrapper>
        ) : null}
      </StyledMenuButton>
      {isOpened && (
        <MenuFlyout>
          <AutoColumn gap="md" style={{ padding: '1rem' }}>
            <Text fontWeight={600} fontSize={14}>
              Transaction Settings
            </Text>
            <TransactionSettings
              rawSlippage={slippageTolerance}
              setRawSlippage={setSlippageTolerance}
              deadline={deadline}
              setDeadline={setDeadline}
            />
            <Text fontWeight={600} fontSize={14}>
              Interface Settings
            </Text>
            <RowBetween>
              <RowFixed>
                <TYPE.black fontWeight={400} fontSize={14} color={theme.text2}>
                  Toggle Expert Mode
                </TYPE.black>
                <QuestionHelper text="Bypasses confirmation modals and allows high slippage trades. Use at your own risk." />
              </RowFixed>
              <Toggle
                id="toggle-expert-mode-button"
                isActive={expertMode}
                toggle={
                  expertMode
                    ? () => {
                        toggleExpertMode()
                        setShowConfirmation(false)
                      }
                    : () => {
                        setShowConfirmation(true)
                      }
                }
              />
            </RowBetween>
            <RowBetween>
              <RowFixed>
                <TYPE.black fontWeight={400} fontSize={14} color={theme.text2}>
                  Disable Multihops
                </TYPE.black>
                <QuestionHelper text="Restricts swaps to direct pairs only." />
              </RowFixed>
              <Toggle
                id="toggle-disable-multihop-button"
                isActive={singleHopOnly}
                toggle={() => (singleHopOnly ? setSingleHopOnly(false) : setSingleHopOnly(true))}
              />
            </RowBetween>
          </AutoColumn>
        </MenuFlyout>
      )}
    </StyledMenu>
  )
}

export default SwapSettings
