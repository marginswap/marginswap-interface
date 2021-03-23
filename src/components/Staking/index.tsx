import { AppBar, IconButton, Tab } from '@material-ui/core'
import { Divider } from '@material-ui/core'
import Collapse from '@material-ui/core/Collapse'
import React, { FC, useState } from 'react'
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import walletIcon from 'assets/svg/walletIcon.svg'
import {
  StakingWrapper,
  InputWrapper,
  StakingHeader,
  StakingBody,
  ActionButton,
  InputHeader,
  InputTabs,
  InputBox,
  MaxButton,
  Balance
} from './useStyles'

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
      {value === index && <div>{children}</div>}
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
  buttonStyle: string
}

const StakeInput: FC<StakeInput> = ({ title, buttonStyle }: StakeInput) => {
  const [checked, setChecked] = useState(false)
  const open = () => {
    setChecked(prev => !prev)
  }

  const [currentTab, setCurrentTab] = useState(0)
  const handleChangeTab = (event: React.ChangeEvent<Record<string, unknown>>, newValue: number) => {
    setCurrentTab(newValue)
  }

  const [balance] = useState<number>(2.67831148)
  const [APR] = useState<number>(20)
  const [amount, setAmount] = useState<number>()
  const handleChange = (e: any) => {
    setAmount(e.target.value)
  }
  return (
    <InputWrapper>
      <InputHeader>
        <h3 className="title" onClick={open}>
          {title}
          {checked ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </h3>
        <h4 className="approximate">APR {APR}%</h4>
      </InputHeader>
      <Collapse in={checked}>
        <AppBar position="static" className={'root'}>
          <InputTabs
            variant="fullWidth"
            value={currentTab}
            onChange={handleChangeTab}
            aria-label="nav tabs example"
            TabIndicatorProps={{ color: 'transparent' }}
          >
            <LinkTab label="Deposit" href="/#" {...applyTabProps(0)} />
            <LinkTab label="Claim" href="/#" {...applyTabProps(1)} />
            <LinkTab label="Withdraw" href="/#" {...applyTabProps(2)} />
          </InputTabs>
          <Balance>
            <span>Balance :</span>
            <div>
              <img src={walletIcon} width={16} height={15} alt="wallet" />
              <span>{balance}</span>
              <span>MFI/USDC Uniswap LP</span>
            </div>
          </Balance>
          <InputBox>
            <input type="number" value={amount} onChange={handleChange} className="value" placeholder="Enter Amount" />
            <MaxButton onClick={() => setAmount(balance)}>MAX</MaxButton>
          </InputBox>
          <TabPanel value={currentTab} index={0}>
            <ActionButton>
              <button className={buttonStyle}>Deposit</button>
            </ActionButton>
          </TabPanel>
          <TabPanel value={currentTab} index={1}>
            <ActionButton>
              <button className={buttonStyle}>Claim</button>
            </ActionButton>
          </TabPanel>
          <TabPanel value={currentTab} index={2}>
            <ActionButton>
              <button className={buttonStyle}>Withdraw</button>
            </ActionButton>
          </TabPanel>
        </AppBar>
      </Collapse>
    </InputWrapper>
  )
}

export const Staking = () => {
  return (
    <StakingWrapper>
      <StakingHeader>
        <h4>Stake</h4>
        <IconButton>
          <SettingsOutlinedIcon fontSize="small" style={{ color: 'white' }} />
        </IconButton>
      </StakingHeader>
      <StakingBody>
        <StakeInput title="Stake Liquidity Token" buttonStyle={'purple'} />
        <Divider />
        <StakeInput title="Stake MFI" buttonStyle={'green'} />
      </StakingBody>
    </StakingWrapper>
  )
}
