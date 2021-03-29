import { makeStyles, Theme } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import styled from 'styled-components'

export const StyledPaper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 478px;
  height: 665px;
  background: ${({ theme }) => theme.bg2};
  border-radius: 12px;
  border: none;
  padding: 16px 32px 24px;
  box-shadow: 0px 3px 5px -1px rgba(0, 0, 0, 0.2), 0px 5px 8px 0px rgba(0, 0, 0, 0.14),
    0px 1px 14px 0px rgba(0, 0, 0, 0.12);
`

export const Search = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 47px;
  background: ${({ theme }) => theme.bg4};
  border-radius: 38.5px;
  padding: 15px 30px;
  & input {
    background: none;
    border: none;
    font-size: 18px;
    line-height: 18px;
    color: ${({ theme }) => theme.text3};
    outline: none;
    &::placeholder {
      font-size: 15px;
      color: ${({ theme }) => theme.text2};
    }
  }
`

export const ModalButton = styled.button`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 6px;
  height: 45px;
  background: initial;
  border: none;
  padding: 0;
  color: ${({ theme }) => theme.text1};
  cursor: pointer;
  & #select {
    display: flex;
    padding: 5px 8px;
    gap: 6px;
    height: 28px;
    width: 100%;
    background: #4255ff;
    border-radius: 19px;
  }
  & img#dropdown {
    width: 14px;
    height: 18px;
  }
  & span#currencySymbol {
    font-weight: 500;
    font-size: 22px;
    line-height: 27px;
  }
  & img {
    height: 26px;
  }
`

export const CloseButton = styled(CloseIcon)`
  width: 20px;
  height: 20px;
  cursor: pointer;
`

export const useModalStyles = makeStyles((theme: Theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  modalHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  currencyList: {
    height: '380px',
    overflowY: 'auto',
    marginLeft: '-32px'
  },
  currencyImg: {
    height: '50px'
  },
  modalConfirm: {
    width: '100%',
    height: '51px',
    background: '#4255FF',
    borderRadius: '30px',
    border: 'none',
    fontSize: '16px',
    lineHeight: '19px',
    color: '#ffffff',
    cursor: 'pointer'
  }
}))

export const useCurrencyStyles = makeStyles(() => ({
  currency: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    gap: '10px',
    padding: '13px 0',
    paddingLeft: '32px',
    cursor: 'pointer',
    '& h3': {
      margin: '0',
      fontWeight: '500',
      fontSize: '15px',
      lineHeight: '18px'
    },
    '& span': {
      fontSize: '13px',
      lineHeight: '16px',
      color: '#777777'
    },
    '&:hover': {
      background: 'linear-gradient(90deg, #52525236 41.64%, rgba(47, 47, 47, 0) 83.43%)'
    }
  },
  currencyImg: {
    height: '50px'
  }
}))
