import React from 'react'

import Column from '../../components/Column'
import Loader from '../../components/Loader'
import { RowBetween, AutoRow } from '../Row'
import ProgressSteps from '../ProgressSteps'
import { ButtonPrimary, ButtonConfirmed, ButtonError } from '../Button'

import { ApprovalState } from '../../hooks/useApproveCallback'

interface ApprovalStepperProps {
  firstStepLabel: string
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void
  approval: ApprovalState
  approvalSubmitted: boolean
}

export default function ApprovalStepper({
  firstStepLabel,
  onClick,
  approval,
  approvalSubmitted
}: ApprovalStepperProps) {
  return (
    <>
      <RowBetween>
        <ButtonConfirmed
          onClick={onClick}
          disabled={approvalSubmitted}
          width="48%"
          altDisabledStyle={approval === ApprovalState.PENDING} // show solid button while waiting
          confirmed={approval === ApprovalState.APPROVED}
        >
          {approval === ApprovalState.PENDING ? (
            <AutoRow gap="6px" justify="center">
              Approving <Loader stroke="white" />
            </AutoRow>
          ) : approvalSubmitted && approval === ApprovalState.APPROVED ? (
            'Approved'
          ) : (
            `Approve ${firstStepLabel}`
          )}
        </ButtonConfirmed>
        <ButtonPrimary
          onClick={() => false}
          width="48%"
          id="swap-button-1"
          disabled={approval !== ApprovalState.APPROVED}
        >
          <AutoRow gap="6px" justify="center">
            Stake
          </AutoRow>
        </ButtonPrimary>
      </RowBetween>
      <Column style={{ marginTop: '1rem' }}>
        <ProgressSteps steps={[approval === ApprovalState.APPROVED]} />
      </Column>
    </>
  )
}
