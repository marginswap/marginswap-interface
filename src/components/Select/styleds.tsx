import styled from 'styled-components'
import { darken } from 'polished'
import Dropdown from '../../assets/images/dropdown-white.svg'

export const StyledSelect = styled.select<{ selected: boolean }>`
  display: flex;
  background-color: ${({ theme }) => theme.primary1};
  height: 40px;
  width: 48%;
  border-radius: 10px;
  font-family: 'Inter', sans-serif !important;
  color: ${({ theme }) => theme.white} !important;
  text-align: center;
  border: 1px solid ${({ theme }) => theme.black};
  font-size: 16px;
  font-weight: 500;
  padding: 0.6em 1.4em 0.5em 0.8em;
  background-image: url(${Dropdown});
  background-repeat: no-repeat;
  background-position-x: 95%;
  background-position-y: center;
  appearance: none;
  outline: none;
  :focus,
  :hover {
    background-color: ${({ selected, theme }) => (selected ? theme.bg2 : darken(0.05, theme.primary1))};
  }
`
