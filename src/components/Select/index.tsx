import React, { useState } from 'react'
import { StyledSelect } from './styleds'
import MenuItem from '@material-ui/core/MenuItem'

type SelectProps = {
  value?: string
  options: string[]
}

const Select = ({ options, value: selected = '' }: SelectProps) => {
  const [selectOption, setSelectOption] = useState(selected || options[0])

  const handleChange = (value: any) => {
    setSelectOption(value)
  }

  return (
    <StyledSelect value={selectOption} onChange={e => handleChange(e.target.value)}>
      {options.map(option => (
        <MenuItem key={option} value={option}>
          {option}
        </MenuItem>
      ))}
    </StyledSelect>
  )
}

export default Select
