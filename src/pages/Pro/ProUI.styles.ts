import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  width: 90%;

  @media screen and (max-width: 960px) {
    flex-direction: column;
    width: 80%;
  }

  @media screen and (max-width: 480px) {
    flex-direction: column;
    width: 90%;
  }
`

export const LeftContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 25%;

  @media screen and (max-width: 960px) {
    flex-direction: row;
    width: 100%;
  }

  @media screen and (max-width: 480px) {
    flex-direction: column;
    width: 100%;
  }
`

export const CenterContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  > div {
    border: 1px solid #525252;
  }

  @media screen and (max-width: 960px) {
    width: 100%;
    margin-bottom: 10px;
  }
`

export const ChartContainer = styled.div`
  height: 400px;
`

export const RightContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 25%;

  @media screen and (max-width: 960px) {
    flex-direction: row;
    width: 100%;
  }

  @media screen and (max-width: 480px) {
    flex-direction: column;
    width: 100%;
  }
`

export const WidgetContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 10px 10px 10px;
  gap: 2vh;

  @media screen and (max-width: 960px) {
    flex-direction: row;
    margin: 0 0px 10px 0px;
    width: 100%;
  }

  @media screen and (max-width: 480px) {
    flex-direction: column;
    margin: 0 0px 10px 0px;
    width: 100%;
  }
`
