import styled from 'styled-components'
import { RowBetween } from '../Row'

export const ToggleWrapper = styled(RowBetween)`
  background-color: ${({ theme }) => theme.bg3};
  border-radius: 12px;
  padding: 6px;
`
export const ToggleOption = styled.div<{ active?: boolean }>`
  width: 48%;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  font-weight: 600;
  background-color: ${({ theme, active }) => (active ? '#2172E5' : theme.bg3)};
  color: ${({ theme, active }) => (active ? theme.text1 : theme.text2)};
  user-select: none;

  :hover {
    cursor: pointer;
    opacity: 0.7;
  }
`
