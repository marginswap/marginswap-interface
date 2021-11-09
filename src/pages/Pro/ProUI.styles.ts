import styled from 'styled-components'
import { DEVICE } from 'theme/device'

export const Container = styled.div`
  display: flex;
  flex-direction: row;

  @media ${DEVICE.mobileS} {
    flex-direction: column;
  }

  @media ${DEVICE.tablet} {
    flex-direction: column;
  }

  @media ${DEVICE.laptop} {
    max-width: 95%;
    flex-direction: row;
  }
`

export const LeftContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 21%;

  @media ${DEVICE.mobileS} {
    flex-direction: row;
    width: 100%;
  }

  @media ${DEVICE.laptop} {
    flex-direction: row;
    width: 20%;
  }
`

export const CenterContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 58%;

  > div {
    border: 1px solid #525252;
  }

  @media ${DEVICE.mobileS} {
    flex-direction: column;
    width: 100%;
  }

  @media ${DEVICE.tablet} {
    flex-direction: column;
  }

  @media ${DEVICE.laptop} {
    margin: 0 10px 10px 10px;
    width: 60%;
  }
`

export const RightContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 21%;

  @media ${DEVICE.mobileS} {
    flex-direction: row;
    width: 100%;
  }

  @media ${DEVICE.laptop} {
    flex-direction: row;
    width: 20%;
  }
`

export const ChartContainer = styled.div`
  height: 400px;
`

export const WidgetContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2vh;

  @media ${DEVICE.mobileS} {
    flex-direction: column;
    width: 100%;
  }

  @media ${DEVICE.tablet} {
    flex-direction: row;
    width: 100%;
  }

  @media ${DEVICE.laptop} {
    flex-direction: column;
    width: 100%;
  }
`
