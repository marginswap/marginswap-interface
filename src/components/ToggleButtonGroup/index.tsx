import React, { Dispatch, SetStateAction } from 'react'
import { FlatToggleOption, ToggleOption, ToggleWrapper } from './ToggleButtonGroup.styles'

type Dispatcher<S> = Dispatch<SetStateAction<S>>

type ToggleSelectorProps = {
  options: [string, string]
  state: boolean
  setState: Dispatcher<boolean>
  big?: boolean
  flat?: boolean
}

const ToggleButtonGroup = ({ options, state, setState, big = false, flat = false }: ToggleSelectorProps) => {
  const renderToggleButtons = () => {
    if (flat) {
      return (
        <>
          <FlatToggleOption onClick={() => setState(true)} active={state} big={big}>
            {options[0]}
          </FlatToggleOption>
          <FlatToggleOption onClick={() => setState(false)} active={!state} big={big}>
            {options[1]}
          </FlatToggleOption>
        </>
      )
    }

    return (
      <>
        <ToggleOption onClick={() => setState(true)} active={state} big={big}>
          {options[0]}
        </ToggleOption>
        <ToggleOption onClick={() => setState(false)} active={!state} big={big}>
          {options[1]}
        </ToggleOption>
      </>
    )
  }

  return <ToggleWrapper>{renderToggleButtons()}</ToggleWrapper>
}

export default ToggleButtonGroup
