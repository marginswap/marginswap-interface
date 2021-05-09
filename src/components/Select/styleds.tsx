import styled from 'styled-components'
import Select from '@material-ui/core/Select'

export const StyledSelect = styled(Select)`
  background-color: ${({ theme }) => theme.primary1};
  height: 40px;
  width: 48%;
  border-radius: 10px;
  color: ${({ theme }) => theme.white} !important;
  text-align: center;
  border: 1px solid ${({ theme }) => theme.black};
`
