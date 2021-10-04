import styled from 'styled-components'

export const StyledInputWrapper = styled.div`
  display: flex;
  flex-direction: row;
  background-color: #181818;
  border-radius: 8px;
  border: 1px solid #5c5c5c;
  margin-bottom: 10px;
  margin-top: 10px;
`

export const StyledInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  color: white;
  width: 75%;
  padding: 7px;

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
  min-width: 100px;
  width: 25%;
  background-color: #3d3d3d;
  color: white;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  text-align: center;
  font-size: 1.12rem;
`
