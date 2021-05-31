import React from 'react'

import Column from '../../components/Column'
import Loader from '../../components/Loader'
import { RowBetween, AutoRow } from '../Row'
import ProgressSteps from '../ProgressSteps'
import { ButtonPrimary, ButtonConfirmed } from '../Button'

import { ApprovalState } from '../../hooks/useApproveCallback'

interface ApprovalStepperProps {
  firstStepLabel: string
  firstStepOnClick: (event: React.MouseEvent<HTMLButtonElement>) => void
  secondStepLabel: string
  secondStepOnClick: (event: React.MouseEvent<HTMLButtonElement>) => void
  approval: ApprovalState
  approvalSubmitted: boolean
}

export default function ApprovalStepper({
  firstStepLabel,
  firstStepOnClick,
  secondStepLabel,
  secondStepOnClick,
  approval,
  approvalSubmitted
}: ApprovalStepperProps) {
  return (
    <>
      <RowBetween>
        <ButtonConfirmed
          onClick={firstStepOnClick}
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
          onClick={secondStepOnClick}
          width="48%"
          height="63px"
          id="swap-button-1"
          disabled={approval !== ApprovalState.APPROVED}
        >
          <AutoRow gap="6px" justify="center">
            {secondStepLabel}
          </AutoRow>
        </ButtonPrimary>
      </RowBetween>
      <Column style={{ marginTop: '1rem' }}>
        <ProgressSteps steps={[approval === ApprovalState.APPROVED]} />
      </Column>
    </>
  )
}
