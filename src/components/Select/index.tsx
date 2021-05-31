import React from 'react'
import { StyledSelect } from './styleds'

type SelectOption = {
  options: { value: string; label: string }[]
}

const Select = ({ options, ...props }: SelectOption) => {
  return (
    <StyledSelect {...props}>
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </StyledSelect>
  )
}

export default Select
