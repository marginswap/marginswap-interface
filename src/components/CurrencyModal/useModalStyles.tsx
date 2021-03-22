import { makeStyles, Theme } from '@material-ui/core'

export const useModalStyles = makeStyles((theme: Theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '478px',
    height: '665px',
    background: '#212121',
    borderRadius: '12px',
    border: 'none',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3)
  },
  modalButton: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '6px',
    height: '45px',
    background: 'initial',
    color: 'inherit',
    border: 'none',
    padding: '0',
    cursor: 'pointer',
    '& #select': {
      display: 'flex',
      padding: '5px 8px',
      gap: '6px',
      height: '28px',
      width: '100%',
      background: '#4255FF',
      borderRadius: '19px'
    },
    '& img#dropdown': {
      width: '14px',
      height: '18px'
    },
    '& span#currencySymbol': {
      fontWeight: '500',
      fontSize: '22px',
      lineHeight: '27px'
    },
    '& img': {
      height: '26px'
    }
  },
  modalHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    '& img': {
      filter: 'invert()',
      cursor: 'pointer'
    }
  },
  search: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: '47px',
    background: 'rgba(59, 59, 60, 0.7)',
    borderRadius: '38.5px',
    padding: '15px 30px',
    '& input': {
      background: 'none',
      border: 'none',
      fontSize: '15px',
      lineHeight: '18px',
      color: 'inherit'
    }
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
    color: 'inherit',
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
      background: 'linear-gradient(90deg, #525252 41.64%, rgba(47, 47, 47, 0) 83.43%)'
    }
  },
  currencyImg: {
    height: '50px'
  }
}))
