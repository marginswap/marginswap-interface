import styled from 'styled-components'
import { FormControlLabel, Table, TableCell, TableRow, TableSortLabel } from '@material-ui/core'
import InfoIcon from '@material-ui/icons/InfoOutlined'

export const StyledTableWrapper = styled('div')`
  border: 1px solid #777777;
  border-radius: 32px;
  padding: 24px 0;

  h3 {
    margin: 0 0 0 52px;
    color: white;
    font-size: 22px;
  }

  h4 {
    font-size: 18px;
    font-weight: 600;
    color: white;
  }
`

export const StyledTable = styled(Table)`
  color: white;
`

export const StyledTableSortLabel = styled(TableSortLabel)`
  color: rgb(208, 208, 208) !important;

  &:hover {
    color: rgba(208, 208, 208, 0.5) !important;
  }

  .MuiTableSortLabel-icon {
    color: #d0d0d0 !important;
  }
`

export const StyledTableRow = styled(TableRow)`
  background-color: transparent !important;
  padding: 0 24px 0 52px;

  &.Mui-selected,
  &:hover {
    background: linear-gradient(to right, #525252, transparent) !important;
  }
`

export const StyledTableCell = styled(TableCell)`
  color: ${({ style }) => style?.color ?? 'white'} !important;
  font-size: 13px !important;
  font-weight: 500 !important;
  border-bottom: ${({ style }) => style?.borderBottom ?? '1px solid #777777 !important'};
`

export const ActionsCell = styled.div<{ size: number }>`
  width: ${({ size }) => `${size * 100}px`};
`

export const StyledFormControlLabel = styled(FormControlLabel)`
  color: white;

  .MuiSwitch-track {
    background-color: #2dde9e;
    opacity: 0.5;
  }

  .Mui-checked .MuiSwitch-thumb {
    background-color: currentColor;
  }

  .MuiSwitch-thumb {
    background-color: #2dde9e;
  }

  @media (max-width: 768px) {
    display: none !important;
  }
`

export const StyledInfoIcon = styled(InfoIcon)`
  margin-left: 5px;
`
