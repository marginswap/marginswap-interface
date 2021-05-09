import React, { Dispatch, SetStateAction } from 'react'
import { ToggleWrapper, ToggleOption } from './styleds'

type Dispatcher<S> = Dispatch<SetStateAction<S>>

type ToggleSelectorProps = {
  options: [string, string]
  state: boolean
  setState: Dispatcher<boolean>
}

const ToggleSelector = ({ options, state, setState }: ToggleSelectorProps) => {
  return (
    <ToggleWrapper>
      <ToggleOption onClick={() => setState(true)} active={state}>
        {options[0]}
      </ToggleOption>
      <ToggleOption onClick={() => setState(false)} active={!state}>
        {options[1]}
      </ToggleOption>
    </ToggleWrapper>
  )
}

export default ToggleSelector
