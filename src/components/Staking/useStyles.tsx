import { Tabs } from '@material-ui/core'
import styled from 'styled-components'

export const StakingWrapper = styled.div`
  margin: auto;
  display: flex;
  border-radius: 20px;
  flex-direction: column;
  backdrop-filter: blur(10px);
  background: initial;
  box-shadow: 0px 0px 1px rgb(0 0 0 / 1%), 0px 4px 8px rgb(0 0 0 / 4%), 0px 16px 24px rgb(0 0 0 / 4%),
    0px 24px 32px rgb(0 0 0 / 1%);
  border: 1px solid #777777;
`
export const StakingHeader = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 60px;
  justify-content: space-between;
  align-items: center;
  padding: 0 30px;
  margin-top: 10px;
  & h4 {
    font-weight: normal;
    font-size: 22px;
    line-height: 27px;
    color: ${({ theme }) => theme.text1};
  }
  & button {
    padding: 0;
  }
  & .settings {
    max-width: 40px;
  }
`

export const StakingBody = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 20;
  background-color: initial;
  min-height: 20;
  align-self: center;
  padding: 0 22px;
`

export const ActionButton = styled.div`
  gap: 10px;
  width: 100%;
  display: flex;
  justify-content: center;
  & button {
    text-transform: none;
    color: #fff;
    border-radius: 30px;
    border: none;
    height: 51px;
    width: 100%;
    font-weight: 600;
    font-size: 16px;
    line-height: 19px;
    cursor: pointer;
  }
  & button:focus {
    outline: none;
  }
  & .green {
    background: linear-gradient(270deg, #2dde9e 0%, #4255ff 100%);
  }
  & .purple {
    background: linear-gradient(270deg, #ad01ff 0%, #4255ff 100%);
  }
`

export const InputWrapper = styled.div`
  padding: 10px;
  font-size: 14px;
  font-weight: 600;
  & .root {
    display: flex;
    flex-direction: column;
    gap: 20px;
    box-shadow: none;
    background: none;
    padding-bottom: 22px;
    color: inherit;
  }
`
export const InputHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  & .title {
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  & .approximate {
    word-spacing: 8px;
    color: ${({ theme }) => theme.text3};
  }
`

export const InputTabs = styled(Tabs)`
  height: 48px;
  background: ${({ theme }) => theme.bg2};
  border-radius: 7px;
  border: 1px solid;
  border-image-source: linear-gradient(149.42deg, #ffffff 3.01%, rgba(147, 147, 147, 0) 100.86%);
  & a {
    padding: 0;
    height: 36px;
    color: ${({ theme }) => theme.text3};
    &[aria-selected='true'] {
      color: #ffffff;
      background: #4255ff;
      border-radius: 7px;
    }
  }
`

export const InputBox = styled.div`
  width: 100%;
  height: 52px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  background: hsl(0deg 0% 0% / 20%);
  border-radius: 10px;
  & .value {
    font-size: 17px;
    font-weight: 500;
    line-height: 16px;
    width: inherit;
    border: 0;
    background: 0;
    color: ${({ theme }) => theme.text1};
    &::placeholder {
      font-size: 13px;
      color: ${({ theme }) => theme.text2};
    }
  }
`

export const Balance = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 8px;
  & div {
    display: flex;
    flex-direction: row;
    gap: 10px;
  }
  & span {
    font-style: normal;
    font-weight: 500;
    font-size: 13px;
    line-height: 16px;
    color: ${({ theme }) => theme.text3};
  }
`
