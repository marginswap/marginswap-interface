import React, { Dispatch, SetStateAction } from 'react'
import { ToggleOption, ToggleWrapper } from './ToggleButtonGroup.styles'

type Dispatcher<S> = Dispatch<SetStateAction<S>>

type ToggleSelectorProps = {
  options: [string, string]
  state: boolean
  setState: Dispatcher<boolean>
  big?: boolean
}

const ToggleButtonGroup = ({ options, state, setState, big = false }: ToggleSelectorProps) => {
  return (
    <ToggleWrapper>
      <ToggleOption onClick={() => setState(true)} active={state} big={big}>
        {options[0]}
      </ToggleOption>
      <ToggleOption onClick={() => setState(false)} active={!state} big={big}>
        {options[1]}
      </ToggleOption>
    </ToggleWrapper>
  )
}

export default ToggleButtonGroup
