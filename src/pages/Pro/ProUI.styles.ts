import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  width: 80%;
`

export const LeftContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 25%;
`

export const CenterContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;

  > div {
    border: 1px solid #525252;
  }
`

export const RightContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 25%;
`

export const WidgetContainer = styled.div`
  background-color: #161618;
  min-height: 200px;
  margin: 0 10px 10px 5px;
  border-radius: 7px;
`
