import { makeStyles } from '@material-ui/core'
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward'
import styled from 'styled-components'

export const PagerSwapWrapper = styled.div`
  backdrop-filter: blur(25px);
  border-radius: 32px;
  border: 1px solid #777777;
  margin: auto;
  height: 660px;
  padding: 0 20px;
  display: flex;
  flex-direction: column;
`

export const PagerSwapHeader = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  & > h4 {
    margin: 20px 5px;
    font-weight: 600;
    font-size: 22px;
    line-height: 27px;
  }
`

export const FullWidthPair = styled.div`
  & p > span:nth-child(odd) {
    float: left;
    & img {
      margin: 0 0 -3px 11px;
    }
  }
  & > p > span:nth-child(even) {
    float: right;
  }
  & > p {
    margin: 0;
    font-size: 0.8em;
    font-weight: 600;
  }
`

export const ParametersSection = styled(FullWidthPair)`
  height: 58px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 8px;
  justify-content: space-evenly;
  color: ${({ theme }) => theme.text3};
`

export const useStyles = makeStyles(() => ({
  actions: {
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
    margin: 'auto 0 18px 0',
    '& .MuiButtonBase-root': {
      backgroundColor: 'white',
      textTransform: 'none',
      width: '100%',
      borderRadius: '30px',
      height: '51px',
      fontWeight: 700,
      fontSize: '16px',
      lineHeight: '24px',
      marginBottom: '12px',
      '&#spot': {
        background: 'linear-gradient(270deg, #2DDE9E 0%, #4255FF 100%)',
        color: '#fff'
      },
      '&#swap': {
        background: 'linear-gradient(270deg, #AD01FF 0%, #3122FB 100%)',
        color: '#fff'
      }
    }
  },
  settings: {
    width: '40px',
    height: '40px',
    margin: 'auto 0',
    position: 'relative',
    right: '-10px'
  },
  root: {
    backgroundColor: 'initial',
    borderRadius: '20px',
    justifyContent: 'space-between',
    boxShadow: 'none'
  },
  tabs: {
    height: '48px',
    background: 'rgba(49, 49, 49, 0.5)',
    borderRadius: '7px',
    '& a': {
      padding: '0',
      heigth: '48px',
      '&[aria-selected=true]': {
        background: '#4255FF',
        borderRadius: '7px'
      },
      '&[aria-selected=false]': {}
    }
  },
  tabPanel: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginTop: '16px'
  }
}))

export const InputWrapper = styled(FullWidthPair)`
  border-radius: 10px;
  border: 1px solid lightgray;
  padding: 12px 18px;
  font-size: 14;
  font-weight: 600;
  & p {
    color: ${({ theme }) => theme.text2};
  }
`

export const Input = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 6px;
  & .value {
    width: 40%;
    font-weight: bold;
    font-size: 18px;
    color: ${({ theme }) => theme.text1};
    border: 0;
    font-family: sans-serif;
    background-color: initial;
    -moz-appearance: textfield;
    &::placeholder {
      font-size: 13px;
      color: ${({ theme }) => theme.text2};
    }
  }
`

export const MidleWrapper = styled.div`
  height: 32;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 8px;
  gap: 8px;
  & span {
    font-weight: 500;
    font-size: 13px;
    line-height: 16px;
    color: ${({ theme }) => theme.text2};
  }
`

export const useInputStyles = makeStyles(() => ({
  formControl: {
    display: 'inline-block',
    minWidth: 70,
    paddingLeft: '12px',
    '& .MuiInputBase-root': {
      fontWeight: '500',
      fontSize: '15px',
      lineHeight: '18px',
      textAlign: 'center'
    }
  },
  selectEmpty: {
    marginTop: 0,
    '& .MuiSelect-root': {
      display: 'flex',
      alignItems: 'center'
    }
  },
  currencyImg: {
    margin: '4px 8px 4px 8px',
    height: '24px'
  },
  currencyWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    '& .MuiInputBase-root': {
      color: '#fff'
    }
  }
}))

export const SwapArrow = styled(ArrowDownwardIcon)`
  margin: auto;
  color: ${({theme}) => theme.text1};
  cursor: pointer;
`

export const useTooltipStyles = makeStyles(() => ({
  tooltip: {
    maxWidth: '120px',
    background: '#181818',
    border: '0.4px solid #777777'
  }
}))
