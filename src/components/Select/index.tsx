import React from 'react'
import { StyledSelect } from './styleds'

export function Select({ register, options, name, ...rest }: any) {
  return (
    <StyledSelect {...register(name)} {...rest}>
      {options.map((option: any) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </StyledSelect>
  )
}

export default Select
