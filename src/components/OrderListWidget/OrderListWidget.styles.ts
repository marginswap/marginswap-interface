import styled from 'styled-components'
import { Button } from '@material-ui/core'
import { darken } from 'polished'

export const Container = styled.div`
  background-color: #2b2b2c;
  border-radius: 7px;
  display: flex;
  flex-direction: column;
  height: 410px;
  margin-top: 10px;
`

export const StyledDefaultButton = styled(Button)`
  > span {
    color: white;
  }
`

export const ActionsHeader = styled.div`
  background-color: #161618;
  border-top-left-radius: 7px;
  border-top-right-radius: 7px;
  height: 40px;
  width: 100%;

  > button {
    height: 30px;
    margin-top: 5px;
    margin-left: 7px;
    text-transform: capitalize;
  }
`

export const GridContainer = styled.div`
  padding: 10px;
`

export const Header = styled.div`
  display: flex;
  flex-direction: row;
  padding: 8px;
  width: 100%;
  margin-bottom: 4px;
  border-bottom: 1px solid #525252;

  > div {
    font-size: 12px;
    width: 22.5%;
  }

  > div:last-child {
    width: 10%;
  }
`

export const Item = styled.div`
  color: white;
  width: 100%;
  font-size: 12px;
`

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  padding: 6px;
  width: 100%;
  align-items: center;

  > div {
    display: flex;
    flex-direction: column;
    font-size: 13px;
    width: 22.5%;
  }

  > div:last-child {
    width: 10%;
  }

  :hover {
    background: linear-gradient(90deg, rgba(34, 95, 74, 0.75) 0%, rgba(43, 50, 109, 0.75) 100%);
  }
`

export const CancelButton = styled.div`
  cursor: pointer;
  align-items: center;
  color: ${({ theme }) => theme.text1};
  background-color: ${({ theme }) => theme.red1};
  padding: 0.35em 0.65em;
  border-radius: 0.25rem;
  width: 50%;
  text-align: center;
  white-space: nowrap;
  display: inline-block;
  line-height: 1;
  font-size: 0.7rem;
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  @media (max-width: 600px) {
    padding: 0.25em;
  }

  &:focus {
    box-shadow: 0 0 0 1pt ${({ theme }) => darken(0.05, theme.red1)};
    background-color: ${({ theme }) => darken(0.05, theme.red1)};
  }
  &:hover {
    background-color: ${({ theme }) => darken(0.05, theme.red1)};
  }
  &:active {
    box-shadow: 0 0 0 1pt ${({ theme }) => darken(0.1, theme.red1)};
    background-color: ${({ theme }) => darken(0.1, theme.red1)};
  }
  &:disabled {
    opacity: 50%;
    cursor: auto;
    box-shadow: none;
    background-color: ${({ theme }) => theme.red1};
    border: 1px solid ${({ theme }) => theme.red1};
  }
`

export const Badge = styled.div`
  align-items: center;
  color: ${({ theme }) => theme.text1};
  background-color: #444446;
  padding: 0.35em 0.65em;
  border-radius: 0.25rem;
  text-align: center;
  white-space: nowrap;
  display: inline-block;
  line-height: 1;
  font-size: 0.7rem;
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  @media (max-width: 600px) {
    padding: 0.25em;
  }
`

export const Span = styled.span`
  @media (max-width: 600px) {
    font-size: 0.75em;
  }
`
