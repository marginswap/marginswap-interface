import styled from 'styled-components'
import { Button } from '@material-ui/core'

export const Container = styled.div`
  background-color: #2b2b2c;
  border-radius: 7px;
  display: flex;
  flex-direction: column;
  height: 383px;
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
    width: 20%;
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

  > div {
    display: flex;
    flex-direction: column;
    font-size: 13px;
    width: 20%;
  }
`
