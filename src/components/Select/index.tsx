import React from 'react'
import { StyledSelect } from './styleds'

type SelectProps = {
  options: string[]
}

const Select = ({ options, ...props }: SelectProps) => {
  return (
    <StyledSelect {...props}>
      {options.map(option => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </StyledSelect>
  )
}

export default Select
