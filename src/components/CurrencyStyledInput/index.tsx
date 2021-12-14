import React from 'react'
import { StyledInputWrapper, StyledInputContainer, StyledInputAdornment } from './CurrencyStyledInput.styles'

type CurrencyStyledInputProps = {
  label: string
  symbol?: string
  placeholder?: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  readOnly?: boolean
  value: string
}

const CurrencyStyledInput = ({
  label,
  symbol = '',
  placeholder = '',
  onChange,
  readOnly = false,
  value = ''
}: CurrencyStyledInputProps) => {
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const re = /^[0-9]*\.?[0-9]*$/
    if (e.target.value === '' || re.test(e.target.value)) {
      onChange(e)
    }
  }

  return (
    <StyledInputWrapper>
      <StyledInputContainer>
        <label>{label}</label>
        <input type="text" value={value} placeholder={placeholder} onChange={handleInput} readOnly={readOnly} />
      </StyledInputContainer>
      <StyledInputAdornment>
        <p>{symbol}</p>
      </StyledInputAdornment>
    </StyledInputWrapper>
  )
}

export default CurrencyStyledInput
