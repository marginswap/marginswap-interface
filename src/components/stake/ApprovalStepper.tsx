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
        {approval !== ApprovalState.APPROVED ? (
          <ButtonPrimary
            onClick={firstStepOnClick}
            disabled={approvalSubmitted}
            altDisabledStyle={approval === ApprovalState.PENDING} // show solid button while waiting
          >
            {approval === ApprovalState.PENDING ? (
              <AutoRow gap="6px" justify="center">
                Approving <Loader stroke="white" />
              </AutoRow>
            ) : (
              `Approve`
            )}
          </ButtonPrimary>
        ) : (
          <ButtonPrimary
            onClick={secondStepOnClick}
            height="63px"
            id="swap-button-1"
            disabled={approval !== ApprovalState.APPROVED}
          >
            <AutoRow gap="6px" justify="center">
              {secondStepLabel}
            </AutoRow>
          </ButtonPrimary>
        )}
      </RowBetween>
    </>
  )
}
