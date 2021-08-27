import React from 'react'

import { RowBetween, AutoRow } from '../Row'
import { ButtonPrimary } from '../Button'

interface MigrateStepperProps {
  firstStepOnClick: (event: React.MouseEvent<HTMLButtonElement>) => void
  secondStepLabel: string
  secondStepOnClick: (event: React.MouseEvent<HTMLButtonElement>) => void
  migrated: boolean
}

export default function MigrateStepper({
  firstStepOnClick,
  secondStepLabel,
  secondStepOnClick,
  migrated
}: MigrateStepperProps) {
  return (
    <>
      <RowBetween>
        <ButtonPrimary
          width="48%"
          onClick={firstStepOnClick}
          disabled={!migrated}
          altDisabledStyle={!migrated} // show solid button while waiting
        >
          Migrate
        </ButtonPrimary>

        <ButtonPrimary onClick={secondStepOnClick} width="48%" height="63px" id="swap-button-1" disabled={migrated}>
          <AutoRow gap="6px" justify="center">
            {secondStepLabel}
          </AutoRow>
        </ButtonPrimary>
      </RowBetween>
    </>
  )
}
