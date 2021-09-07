import styled from 'styled-components'
import { RowBetween } from '../Row'

export const ToggleWrapper = styled(RowBetween)`
  background-color: #191919;
  padding: 6px;
`
export const ToggleOption = styled.div<{ active?: boolean; big?: boolean }>`
  width: 48%;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-weight: 600;
  font-size: 13px;
  background-color: ${({ active }) => (active ? '#2172E5' : '#2e3233')};
  color: white;
  user-select: none;
  height: ${({ big }) => (big ? '70px' : '')};

  :hover {
    cursor: pointer;
    opacity: 0.7;
  }
`
