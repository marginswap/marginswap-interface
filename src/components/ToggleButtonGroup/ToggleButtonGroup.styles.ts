import styled from 'styled-components'
import { RowBetween } from '../Row'

export const ToggleWrapper = styled(RowBetween)`
  background-color: #191919;
  padding: 6px;
`
export const ToggleOption = styled.div<{ active?: boolean; big?: boolean }>`
  width: 50%;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  background-color: ${({ active }) => (active ? '#2172E5' : '#2e3233')};
  color: white;
  user-select: none;
  height: ${({ big }) => (big ? '70px' : '')};

  :hover {
    cursor: pointer;
    opacity: 0.7;
  }
`

export const FlatToggleOption = styled.div<{ active?: boolean; big?: boolean }>`
  width: 50%;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 15px;
  border-bottom: ${({ active }) => (active ? '3px solid #3f51b5' : '1px solid #898989')};
  color: white;
  user-select: none;
  height: ${({ big }) => (big ? '70px' : '')};

  :hover {
    cursor: pointer;
    opacity: 0.9;
  }
`
