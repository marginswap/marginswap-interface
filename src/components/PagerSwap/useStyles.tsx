import { makeStyles } from '@material-ui/core'

export const useStyles = makeStyles(() => ({
  wrapper: {
    backgroundColor: 'initial',
    background: 'rgba(50, 50, 50, 0.25)',
    backdropFilter: 'blur(10px)',
    borderRadius: 20,
    border: '1px solid #777777',
    margin: 'auto',
    padding: '0 20px',
    display: 'flex',
    flexDirection: 'column'
  },
  header: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
    '& > h4': {
      margin: '20px 5px',
      fontHeight: '600',
      fontSize: '22px',
      lineHeight: '27px'
    }
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
  parameters: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    padding: '0 8px',
    justifyContent: 'space-evenly',
    marginBottom: '18px'
  },
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
        color: '#fff',
        '&:disabled': {
          background: 'grey'
        }
      },
      '&#swap': {
        background: 'linear-gradient(270deg, #AD01FF 0%, #3122FB 100%)',
        color: '#fff',
        '&:disabled': {
          background: 'grey'
        }
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
    '& button': {
      padding: '0',
      heigth: '48px',
      '&[aria-selected=true]': {
        background: '#4255FF',
        borderRadius: '7px'
      },
      '&[aria-selected=false]': {}
    },
    '& .MuiTabs-indicator': {
      display: 'none'
    }
  },
  tabPanel: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginTop: '16px'
  }
}))

export const useInputStyles = makeStyles(() => ({
  wrapper: {
    borderRadius: '10px',
    border: '1px solid lightgray',
    padding: '12px 18px',
    fontSize: 14,
    fontWeight: 600
  },
  middleWrapper: {
    height: 32,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 8px',
    cursor: 'pointer',
    '& span': {
      fontWeight: '500',
      fontSize: '13px',
      lineHeight: '16px'
    },
    '& svg': {
      margin: '0 auto'
    }
  },
  input: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '6px',
    '& .value': {
      width: '40%',
      fontWeight: 'bold',
      fontSize: 18,
      color: '#fff',
      border: '0',
      fontFamily: 'sans-serif',
      backgroundColor: 'initial',
      MozAppearance: 'textfield'
    }
  },
  maxButton: {
    backgroundColor: '#4255FF',
    color: '#fff',
    maxHeight: 30,
    fontWeight: 700,
    letterSpacing: '0.085em',
    borderRadius: '4px'
  },
  formControl: {
    display: 'inline-block',
    minWidth: 70,
    paddingLeft: '12px',
    '& .MuiInputBase-root': {
      color: '#fff',
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
  },
  swapArrow: {
    position: 'absolute',
    left: '46.5%'
  }
}))

export const useTooltipStyles = makeStyles(() => ({
  tooltip: {
    maxWidth: '120px',
    background: '#181818',
    border: '0.4px solid #777777'
  }
}))
