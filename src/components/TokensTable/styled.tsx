import styled from 'styled-components'
import { FormControlLabel, Table, TableCell, TableRow, TableSortLabel } from '@material-ui/core'

export const StyledTableWrapper = styled('div')`
  border: 1px solid #777777;
  border-radius: 32px;
  padding: 24px 0;

  h3 {
    margin: 0 0 0 52px;
    color: ${({ theme }) => theme.text1};
    font-size: 22px;
  }

  h4 {
    font-size: 18px;
    font-weight: 600;
    color: ${({ theme }) => theme.text1};
  }
`

export const StyledTable = styled(Table)`
  color: ${({ theme }) => theme.text1};
`

export const StyledTableSortLabel = styled(TableSortLabel)`
  color: ${({ theme }) => theme.text2} !important;

  &:hover {
    color: ${({ theme }) => theme.text3} !important;
  }

  .MuiTableSortLabel-icon {
    color: ${({ theme }) => theme.text2} !important;
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
  color: ${({ theme }) => theme.text1} !important;
  font-size: 13px !important;
  font-weight: 500 !important;
  border-bottom: ${({ style }) => style?.borderBottom ?? '1px solid #777777 !important'};
`

export const StyledFormControlLabel = styled(FormControlLabel)`
  color: ${({ theme }) => theme.text1};

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
`
