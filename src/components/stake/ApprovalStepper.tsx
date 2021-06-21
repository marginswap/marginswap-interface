import React from 'react'

import Loader from '../../components/Loader'
import { RowBetween, AutoRow } from '../Row'
import { ButtonPrimary } from '../Button'

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
  firstStepOnClick,
  secondStepLabel,
  secondStepOnClick,
  approval,
  approvalSubmitted
}: ApprovalStepperProps) {
  console.log('🚀 ~ file: ApprovalStepper.tsx ~ line 28 ~ approval', approval)
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
