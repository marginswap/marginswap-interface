import styled from 'styled-components'
import { DEVICE } from 'theme/device'

export const StyledInputWrapper = styled.div`
  display: flex;
  flex-direction: row;
  background-color: #181818;
  border-radius: 8px;
  border: 1px solid #787879;
  margin-bottom: 10px;
  margin-top: 10px;
`

export const StyledInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  color: white;
  padding: 7px;
  width: 70%;

  @media ${DEVICE.laptop} {
    width: 60%;
  }

  @media ${DEVICE.laptopL} {
    width: 70%;
  }

  > label {
    color: #b2b2b2;
    font-size: 12px;
    margin-bottom: 3px;
    font-weight: 600;
  }

  > input {
    background-color: transparent;
    color: white;
    border: none;
    font-size: 20px;
  }

  > input:focus {
    outline: none;
  }

  > input::placeholder {
    font-size: 18px;
  }
`

export const StyledInputAdornment = styled.div`
  background-color: #3d3d3d;
  color: white;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  text-align: center;
  font-size: 1.12rem;
  width: 30%;

  @media ${DEVICE.laptop} {
    width: 40%;
  }

  @media ${DEVICE.laptopL} {
    width: 30%;
  }
`
