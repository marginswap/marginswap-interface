import { Button, IconButton, makeStyles } from '@material-ui/core'
import React, { FC } from 'react'
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles((theme) => ({
  wrapper: {
    width: '96%',
    maxWidth: 600,
    backgroundColor: '#2c2c5b',
    borderRadius: 20,
    margin: 'auto',
    color: 'white',
    padding: 20,
    display: 'flex',
    flexDirection: 'column',

  },
  header: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between'
  },
  body: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 20,
    backgroundColor: 'white',
    minHeight: 20,
    alignSelf: 'center',
    padding: 20,
  },
  actions: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
    marginTop: 20,
    "& .MuiButtonBase-root": {
      backgroundColor: 'white',
      textTransform: 'none',
      color: '#2c2c5b',
      borderRadius: 20,
      width: '46%',

    }
  },
  settings: {
    maxWidth: 40,
  }
}));
const useInputStyles = makeStyles((theme) => ({
  wrapper: {
    borderRadius: 10,
    border: '1px solid lightgray',
    padding: 10,
    color: '#2c2c5b',
    fontSize: 14,
    margin: '10px 0',
    fontWeight: 600,
  },
  input: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    "& .value": {
      fontWeight: 'bold',
      fontSize: 18,
      color: 'lightgray',
      fontFamily: 'sans-serif'
    }
  },
  button: {
    backgroundColor: '#eff3f5',
    maxHeight: 30,
  }
}))
interface StakeInput {
  title: string,
}
const StakeInput: FC<StakeInput> = ({ title }: StakeInput) => {
  const classes = useInputStyles();
  return (
    <div className={classes.wrapper}>
      <span>{title}</span>
      <div className={classes.input}>
        <span className='value'>0</span>
        <Button variant="contained" size="small" className={classes.button}>MAX</Button>
      </div>
    </div>
  )
}

export const Staking = () => {
  const classes = useStyles();
  return (
    <div className={classes.wrapper}>
      <div className={classes.header}>
        <h4>Stake</h4>
        <IconButton>
          <SettingsOutlinedIcon fontSize="small" style={{ color: 'white' }} />
        </IconButton>
      </div>
      <div className={classes.body}>
        <IconButton size="small" className={classes.settings}>
          <ExpandMoreIcon fontSize="small" />
        </IconButton>
        <StakeInput title="Stake Liquidity Token" />
        <StakeInput title="Stake MFI" />
      </div>
      <div className={classes.actions}>
        <Button variant="outlined" size="large">Deposit</Button>
        <Button variant="outlined" size="large">Withdraw</Button>
      </div>
    </div>
  )
}
