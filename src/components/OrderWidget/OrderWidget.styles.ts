import styled from 'styled-components'
import { Settings } from 'react-feather'
import { Tab, TextField } from '@material-ui/core'

export const Container = styled.div`
  border-radius: 7px;
  display: flex;
  flex-direction: column;
  background-color: #161618;
  width: 100%;
  padding: 10px;
  max-height: 470px;
`

export const SettingsContainer = styled.div<{ show?: boolean }>`
  display: ${props => (props.show ? 'flex' : 'none')};
  flex-direction: row;
  justify-content: flex-end;
  margin-top: 10px;

  > span {
    color: #dedede;
    margin-top: 9px;
    font-size: 12px;
  }
`

export const StyledMenuIcon = styled(Settings)`
  height: 20px;
  width: 20px;

  > * {
    stroke: ${({ theme }) => theme.text2};
  }

  :hover {
    opacity: 0.7;
  }
`

export const PrimaryButton = styled.button`
  background: rgb(46, 32, 185);
  background: ${props =>
    props.disabled ? '#d6d6d6' : 'linear-gradient(90deg, rgba(46, 32, 185, 1) 0%, rgba(128, 11, 188, 1) 100%);'};
  border-radius: 25px;
  color: ${props => (props.disabled ? '#0C0C0C' : 'white')};
  width: 100%;
  border: none;
  height: 40px;

  :hover {
    background: ${props =>
      props.disabled ? '#d6d6d6' : 'linear-gradient(90deg, rgba(59, 45, 196, 1) 0%, rgba(144, 26, 205, 1) 100%);'};
  }
`

export const StyledInput = styled(TextField)`
  && {
    width: 100%;
    color: ${({ theme }) => theme.white} !important;
    border-radius: 7px !important;
    margin: 0.8em 0;
    font-size: 14px !important;
    font-weight: 500 !important;
    input[type='number']::-webkit-inner-spin-button,
    input[type='number']::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    > label,
    input,
    p {
      color: white;
    }

    & .MuiOutlinedInput-root {
      & fieldset {
        border-radius: 10px;
        border-color: #4a4a4a;
      }
      /* &:hover fieldset {
        border-color: white;
      } */
      &.Mui-focused fieldset {
        border-radius: 10px;
        border-color: #3f51b5;
      }
    }
  }
`

export const StyledTab = styled(Tab)`
  > span {
    color: white;
  }
`

export const BottomGrouping = styled.div`
  margin-top: 1rem;
`
