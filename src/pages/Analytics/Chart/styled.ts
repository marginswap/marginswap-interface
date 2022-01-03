import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

export const ButtonsContainer = styled.div`
  display: flex;
  width: 100%;
  margin-bottom: 15px;
`

export const Button = styled.button`
  border-radius: 8px;
  font-weight: 600;
  background-color: transparent;
  border: 1px solid rgb(33, 114, 229);
  color: rgb(255, 255, 255);
  padding: 8px 16px;
  cursor: pointer;
  margin-right: 8px;

  &.active {
    background-color: rgb(33, 114, 229);
  }

  &:hover {
    background-color: rgb(33, 114, 229);
  }
`
