import { AppBar, Box, Button, IconButton, makeStyles, Tab, Tabs } from '@material-ui/core'
import Collapse from '@material-ui/core/Collapse'
import React, { FC, useState } from 'react'
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ExpandLessIcon from '@material-ui/icons/ExpandLess'

const useStyles = makeStyles(() => ({
  wrapper: {
    width: '96%',
    maxWidth: 600,
    backgroundColor: '#2c2c5b',
    borderRadius: 20,
    margin: 'auto',
    color: 'white',
    padding: 20,
    display: 'flex',
    flexDirection: 'column'
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
    padding: 20
  },
  actions: {
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
    marginTop: 20,
    gap: '10px',
    '& .MuiButtonBase-root': {
      backgroundColor: 'white',
      textTransform: 'none',
      color: '#2c2c5b',
      borderRadius: 20,
      width: '46%'
    }
  },
  settings: {
    maxWidth: 40
  }
}))
const useInputStyles = makeStyles(theme => ({
  wrapper: {
    padding: 10,
    color: '#2c2c5b',
    fontSize: 14,
    fontWeight: 600,
    '& .title': {
      margin: '0 0 20px 10px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    }
  },
  root: {
    backgroundColor: theme.palette.background.paper,
    borderRadius: '20px'
  },
  tabs: {
    height: '36px',
    '& a': {
      color: '#2c2c5b',
      padding: '0',
      heigth: '36px',
      '&[aria-selected=true]': {
        border: '1px solid #2c2c5b',
        borderBottom: 'none',
        borderRadius: '20px 20px 0 0',
        borderTopWidth: '1px',
        '&[aria-controls=nav-tabpanel-0]': {
          borderLeftWidth: '0px'
        },
        '&[aria-controls=nav-tabpanel-2]': {
          borderRightWidth: '0px'
        }
      },
      '&[aria-selected=false]': {
        borderBottomWidth: '1px',
        borderBottomStyle: 'solid'
      }
    }
  },
  input: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    gap: '30px',
    alignItems: 'flex-end',
    marginTop: '14px',
    '& .value': {
      fontWeight: 'bold',
      fontSize: 18,
      fontFamily: 'sans-serif'
    }
  },
  button: {
    backgroundColor: '#eff3f5',
    maxHeight: 30
  }
}))

interface TabPanelProps {
  children?: React.ReactNode
  index: any
  value: any
}
function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`nav-tabpanel-${index}`}
      aria-labelledby={`nav-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={1}>{children}</Box>}
    </div>
  )
}
function applyTabProps(index: any) {
  return {
    id: `nav-tab-${index}`,
    'aria-controls': `nav-tabpanel-${index}`
  }
}
interface LinkTabProps {
  label?: string
  href?: string
}
function LinkTab(props: LinkTabProps) {
  return (
    <Tab
      component="a"
      onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        event.preventDefault()
      }}
      {...props}
    />
  )
}

interface StakeInput {
  title: string
}
const StakeInput: FC<StakeInput> = ({ title }: StakeInput) => {
  const classes = useInputStyles()
  const styles = useStyles()

  const [checked, setChecked] = useState(false)
  const open = () => {
    setChecked(prev => !prev)
  }

  const [currentTab, setCurrentTab] = useState(0)
  const handleChangeTab = (event: React.ChangeEvent<{}>, newValue: number) => {
    setCurrentTab(newValue)
  }

  const [amount, setAmount] = useState<number>()
  const handleChange = (e: any) => {
    setAmount(e.target.value)
  }

  return (
    <div className={classes.wrapper}>
      <h3 className="title" onClick={open}>
        {title}
        {checked ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </h3>
      <Collapse in={checked}>
        <AppBar position="static" className={classes.root}>
          <Tabs
            variant="fullWidth"
            value={currentTab}
            onChange={handleChangeTab}
            aria-label="nav tabs example"
            className={classes.tabs}
            TabIndicatorProps={{ color: 'transparent' }}
          >
            <LinkTab label="Deposit" href="/#" {...applyTabProps(0)} />
            <LinkTab label="Claim" href="/#" {...applyTabProps(1)} />
            <LinkTab label="Withdraw" href="/#" {...applyTabProps(2)} />
          </Tabs>
          <TabPanel value={currentTab} index={0}>
            <div className={classes.input}>
              <input type="number" value={amount} onChange={handleChange} className="value" />
              <Button variant="outlined" size="small">
                MAX
              </Button>
            </div>
            <div className={styles.actions}>
              <Button variant="outlined" size="large">
                Deposit
              </Button>
            </div>
          </TabPanel>
          <TabPanel value={currentTab} index={1}>
            <div className={classes.input}>
              <input type="number" value={amount} onChange={handleChange} className="value" />
              <Button variant="outlined" size="small">
                MAX
              </Button>
            </div>
            <div className={styles.actions}>
              <Button variant="outlined" size="large">
                Claim
              </Button>
            </div>
          </TabPanel>
          <TabPanel value={currentTab} index={2}>
            <div className={classes.input}>
              <input type="number" value={amount} onChange={handleChange} className="value" />
              <Button variant="outlined" size="small">
                MAX
              </Button>
            </div>
            <div className={styles.actions}>
              <Button variant="outlined" size="large">
                Withdraw
              </Button>
            </div>
          </TabPanel>
        </AppBar>
      </Collapse>
    </div>
  )
}

export const Staking = () => {
  const classes = useStyles()

  return (
    <div className={classes.wrapper}>
      <div className={classes.header}>
        <h4>Stake</h4>
        <IconButton>
          <SettingsOutlinedIcon fontSize="small" style={{ color: 'white' }} />
        </IconButton>
      </div>
      <div className={classes.body}>
        <StakeInput title="Stake Liquidity Token" />
        <StakeInput title="Stake MFI" />
      </div>
    </div>
  )
}
