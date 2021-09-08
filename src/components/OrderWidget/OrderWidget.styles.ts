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

export const SettingsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin-bottom: 15px;
  margin-right: 10px;
  cursor: pointer;

  > span {
    color: #dedede;
    margin-right: 5px;
    margin-top: 2px;
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
  background: linear-gradient(90deg, rgba(46, 32, 185, 1) 0%, rgba(128, 11, 188, 1) 100%);
  border-radius: 25px;
  color: white;
  width: 100%;
  border: none;
  height: 40px;

  :hover {
    background: linear-gradient(90deg, rgba(59, 45, 196, 1) 0%, rgba(144, 26, 205, 1) 100%);
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
        border-color: #4a4a4a;
      }
      /* &:hover fieldset {
        border-color: white;
      } */
      &.Mui-focused fieldset {
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
