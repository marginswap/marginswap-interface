import styled from 'styled-components'
import { Star } from 'react-feather'

export const Container = styled.div`
  border-radius: 7px;
  display: flex;
  flex-direction: column;
  background-color: #161618;
  width: 100%;
  height: 470px;
  max-height: 470px;
  padding: 5px 10px;
`

export const CoinSelector = styled.div`
  padding-top: 10px;
  color: white;
  text-align: center;
  height: 40px;
  border-bottom: 1px solid #373738;
`

export const Content = styled.div`
  display: flex;
  flex-wrap: wrap;
  overflow-y: auto;
  padding-left: 5px;
  padding-right: 5px;
  max-height: 365px;
  margin-bottom: 15px;

  > div {
    margin-bottom: 10px;
  }
`

export const Header = styled.div`
  display: flex;
  flex-direction: row;
  padding: 8px;
  width: 100%;
  margin-bottom: 4px;

  > div {
    font-size: 12px;
    width: 40%;
  }

  > div:last-child {
    width: 20%;
  }
`

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  padding: 5px;

  > div {
    display: flex;
    flex-direction: column;
    width: 40%;
  }

  > div:last-child {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    width: 20%;

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

  font-size: 12px;

  > span {
    font-size: 0.6rem;
    color: #a7a7a7;
  }
`

export const ChangeValue = styled.div<{ value?: number }>`
  font-weight: 600;
  color: ${({ value }) => (value && value >= 0 ? 'green' : 'red')};
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
