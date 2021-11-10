import styled from 'styled-components'
import { DEVICE } from 'theme/device'

export const WidgetHeader = styled.div`
  padding-top: 10px;
  color: white;
  text-align: center;
  height: 40px;
  border-bottom: 1px solid #373738;
`

export const Container = styled.div`
  background-color: #161618;
  border-radius: 7px;
  padding: 5px 10px;
  color: #fff;
  height: 405px;
  max-height: 405px;

  @media ${DEVICE.tablet} {
    width: 50%;
    margin-top: 10px;
  }

  @media ${DEVICE.laptop} {
    width: 100%;
    margin-top: 0;
  }
`

export const Content = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  overflow-y: auto;
  max-height: 330px;
  margin-bottom: 15px;

  > div:nth-of-type(odd) {
    background-color: #262626;
  }
`

export const Item = styled.div`
  font-size: 12px;
  width: 100%;
  display: flex;
  flex-direction: row;

  > button {
    float: none;
    background-color: #6a6a6a;
    margin-top: -4px;
  }
`

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  line-height: 1.8;

  > div {
    width: 30%;
  }

  > div:last-child {
    width: 40%;
  }
`

export const Header = styled.div`
  background-color: #2b2b2c;
  display: flex;
  flex-direction: row;
  padding: 8px 8px 4px 8px;
  width: 100%;
  margin-bottom: 4px;

  > div {
    font-size: 14px;
    width: 30%;
  }

  > div:last-child {
    width: 40%;
  }
`
