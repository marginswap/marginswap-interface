import Tabs from '@material-ui/core/Tabs'
import OutlinedInput from '@material-ui/core/OutlinedInput'
import { Text } from 'rebass'
import styled from 'styled-components'
import { makeStyles } from '@material-ui/core'

export const LoadingDataContainer = styled.div`
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
`
export const StyledStakeHeader = styled.div`
  padding: 1.5em 1rem 0px 1.5rem;
  margin-bottom: -4px;
  width: 100%;
  max-width: 420px;
  color: ${({ theme }) => theme.text2};
`

export const StyledOutlinedInput = styled(OutlinedInput)`
  width: 100%;
  height: 50px;
  color: ${({ theme }) => theme.white} !important;
  border: 1px solid ${({ theme }) => theme.bg5};
  border-radius: 10px !important;
  padding: 0.5em;
  margin: 1em 0;
  font-size: 24px !important;
  font-weight: 500 !important;
  input[type='number']::-webkit-inner-spin-button,
  input[type='number']::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`

export const DropdownsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  /* TODO - remove this top padding once liquidity staking is enabled */
  padding-top: 0.5em;
`

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
  }
`

export const InputTabs = styled(Tabs)`
  height: 48px;
  background: rgba(49, 49, 49, 0.5);
  border-radius: 7px;
  & a {
    padding: 0;
    height: 36px;
    &[aria-selected='true'] {
      background: #4255ff;
      border-radius: 7px;
    }
  }
`

export const MaxButton = styled.button`
  width: 53px;
  height: 22px;
  background: #4255ff;
  border-radius: 4px;
  border: none;
  font-weight: 500;
  font-size: 12px;
  line-height: 15px;
  color: inherit;
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
    font-weight: 500;
    font-size: 13px;
    line-height: 16px;
    width: inherit;
    border: 0;
    background: 0;
    color: inherit;
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
  }
`

export const StyledBalanceMax = styled.button`
  height: 28px;
  background-color: ${({ theme }) => theme.primary5};
  border: 1px solid ${({ theme }) => theme.primary5};
  border-radius: 0.5rem;
  font-size: 0.875rem;

  font-weight: 500;
  cursor: pointer;
  margin-right: 0.5rem;
  color: ${({ theme }) => theme.primaryText1};
  :hover {
    border: 1px solid ${({ theme }) => theme.primary1};
  }
  :focus {
    border: 1px solid ${({ theme }) => theme.primary1};
    outline: none;
  }

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    margin-right: 0.5rem;
  `};
`

export const DetailsFooter = styled.div`
  padding-top: calc(16px + 2rem);
  padding-bottom: 16px;
  margin-top: -2rem;
  width: 100%;
  max-width: 400px;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  color: ${({ theme }) => theme.text2};
  background-color: ${({ theme }) => theme.advancedBG};
  z-index: 1;
  opacity: 1;
  transition: opacity 0.3s linear;
`
export const ParameterTitle = styled.span`
  font-size: 14px;
  color: #d0d0d0;
  font-weight: 400;
`
export const ParameterResult = styled.span`
  font-size: 14px;
  color: #fff;
  font-weight: 400;
`

export const TruncatedText = styled(Text)`
  text-overflow: ellipsis;
  width: 220px;
  overflow: hidden;
`

export const useStyles = makeStyles(() => ({
  parameters: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    padding: '0 8px',
    justifyContent: 'space-evenly',
    marginBottom: '18px'
  },
  fullWidthPair: {
    '& p > span:nth-child(odd)': {
      float: 'left',
      '& img': {
        margin: '0 0 -3px 11px'
      }
    },
    '& > p > span:nth-child(even)': {
      float: 'right'
    },
    '& > p': {
      margin: '0',
      fontSize: '0.8em',
      fontWeight: '600'
    }
  },
  tooltip: {
    maxWidth: '120px',
    background: '#181818',
    border: '0.4px solid #777777'
  }
}))
