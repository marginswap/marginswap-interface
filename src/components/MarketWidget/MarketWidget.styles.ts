import styled from 'styled-components'
import { Star } from 'react-feather'
import { DEVICE } from 'theme/device'

export const Container = styled.div`
  border-radius: 7px;
  display: flex;
  flex-direction: column;
  background-color: #161618;
  width: 100%;
  height: 400px;
  max-height: 400px;

  @media ${DEVICE.tablet} {
    width: 50%;
  }

  @media ${DEVICE.laptop} {
    width: 100%;
  }
`
export const WidgetBgImg = styled.img`
  position: absolute;
  align-self: flex-end;
  z-index: 1;
  opacity: 0.5;
`

export const PairIcon = styled.img`
  width: 16px;
  margin-left: 30px;
  margin-right: 30px;
`

export const CoinSelector = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  color: white;
  text-align: center;
  border-bottom: 1px solid #373738;
  font-size: 18px;
  padding-top: 15px;
  padding-bottom: 15px;
`

export const CoinSelectorHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`

export const Content = styled.div`
  display: flex;
  flex-wrap: wrap;
  overflow-y: auto;
  max-height: 365px;
  margin-bottom: 15px;
  z-index: 10;

  > div {
    margin-bottom: 10px;
  }
`

export const Header = styled.div`
  display: flex;
  flex-direction: row;
  padding: 10px;
  width: 100%;
  margin-bottom: 4px;
  z-index: 10;

  > div:first-child {
    width: 45%;
  }

  > div {
    font-size: 11px;
    width: 40%;
  }

  > div:last-child {
    display: flex;
    width: 10%;
    justify-content: flex-end;
  }
`

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  padding: 10px;
  cursor: pointer;

  > div:first-child {
    width: 116px;
  }

  > div {
    display: flex;
    flex-direction: column;
    width: 104px;
    font-size: 11px;
  }

  > div:last-child {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    width: 42px;

    > svg {
      margin-left: 7px;
    }
  }

  :hover {
    background: linear-gradient(90deg, rgba(34, 95, 74, 0.75) 0%, rgba(43, 50, 109, 0.75) 100%);
  }
`

export const Item = styled.div`
  color: white;
  width: 100%;

  font-size: 11px;

  > span {
    font-size: 0.6rem;
    color: #a7a7a7;
  }
`

export const ChangeValue = styled.div<{ value?: number }>`
  display: flex;
  font-weight: 600;
  color: ${({ value }) => (value && value >= 0 ? '#0ECA80' : '#FF4E4B')};
`

export const StyledStarIcon = styled(Star)<{ favorite?: boolean }>`
  height: 13px;
  width: 13px;

  > * {
    stroke: ${({ theme }) => theme.text2};
    fill: ${props => (props.favorite ? 'yellow' : 'none')};
  }

  :hover {
    opacity: 0.7;
  }
`
