import styled from 'styled-components'

export const WidgetHeader = styled.div`
  padding-top: 10px;
  color: white;
  text-align: center;
  height: 40px;
  border-bottom: 1px solid #373738;
  margin-bottom: 15px;
`

export const Container = styled.div`
  padding: 5px 10px;
  color: #fff;
`

export const Content = styled.div`
  display: flex;
  flex-wrap: wrap;
`

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;

  > div {
    flex: 50%;
    margin-bottom: 10px;
  }

  > div:last-child {
    text-align: right;
  }
`

export const Item = styled.div`
  font-size: 14px;
  width: 100%;
`

export const Actions = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 15px;
  margin-bottom: 15px;
`

export const PrimaryButton = styled.button`
  background: rgb(46, 32, 185);
  background: linear-gradient(90deg, rgba(46, 32, 185, 1) 0%, rgba(128, 11, 188, 1) 100%);
  border-radius: 25px;
  color: white;
  min-width: 125px;
  border: none;
  height: 40px;

  :hover {
    background: linear-gradient(90deg, rgba(59, 45, 196, 1) 0%, rgba(144, 26, 205, 1) 100%);
  }
`

export const SecondaryButton = styled.button`
  background-color: #2e3233;
  border-radius: 25px;
  color: white;
  min-width: 125px;
  border: none;
  height: 40px;

  :hover {
    background-color: #37393a;
  }
`
