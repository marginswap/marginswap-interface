import { Box, Button, IconButton } from '@material-ui/core'
import AppBar from '@material-ui/core/AppBar'
import Tooltip from '@material-ui/core/Tooltip'
import { Select, MenuItem } from '@material-ui/core'
import Tab from '@material-ui/core/Tab'
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined'
import walletIcon from 'assets/svg/walletIcon.svg'
import question from 'assets/svg/question.svg'
import { TokenInfo } from '@uniswap/token-lists'
import AppBody from 'pages/AppBody'
import { CurrencyModal } from '../CurrencyModal'
import { MaxButton } from '../../theme/components'
import {
  useStyles,
  useInputStyles,
  useTooltipStyles,
  PagerSwapWrapper,
  InputWrapper,
  ParametersSection,
  PagerSwapHeader,
  Input,
  MidleWrapper,
  SwapArrow,
  StyledTabs,
  StyledFormControl
} from './useStyles'
import React, { FC, useEffect, useState } from 'react'

interface StakeInput {
  title: string
  balance: number
  deal: {
    quantity: number
    setQuantity?: React.Dispatch<React.SetStateAction<number>>
    currency: number
    setCurrency: React.Dispatch<React.SetStateAction<number>>
  }
  tokens: TokenInfo[]
}
const StakeInput: FC<StakeInput> = ({ title, balance, deal, tokens }: StakeInput) => {
  const classes = useInputStyles()

  const handleChange = (event: any) => {
    if (!deal.setQuantity) return
    deal.setQuantity(event.target.value)
  }

  const handleSetMax = () => {
    if (!deal.setQuantity) return
    deal.setQuantity(balance)
  }

  return (
    <InputWrapper>
      <p>
        <span>{title}</span>
        <span>Balance: {balance}</span>
      </p>
      <Input>
        <input type="number" value={deal.quantity} min={0} onChange={event => handleChange(event)} className="value" />
        {deal.setQuantity && <MaxButton onClick={handleSetMax}>MAX</MaxButton>}
        <div className={classes.currencyWrapper}>
          {tokens && (
            <>
              <CurrencyModal tokens={tokens} deal={{ currency: deal.currency, setCurrency: deal.setCurrency }} />
            </>
          )}
        </div>
      </Input>
    </InputWrapper>
  )
}

interface MultiplierInput {
  deal: {
    multiplier: number
    setMultiplier: React.Dispatch<React.SetStateAction<number>>
  }
}

const MultiplierInput: FC<MultiplierInput> = ({ deal }: MultiplierInput) => {
  const classes = useInputStyles()

  const handleChangeMultiplier = (event: any) => {
    deal.setMultiplier(event.target.value)
  }

  const oneToNArray = Array.from({ length: 10 }, (_, i) => i + 1)

  return (
    <StyledFormControl>
      <Select
        value={deal.multiplier}
        onChange={handleChangeMultiplier}
        name="age"
        className={classes.selectEmpty}
        inputProps={{ 'aria-label': 'age' }}
      >
        {oneToNArray.map(count => {
          return (
            <MenuItem key={count} value={count}>
              {count} x
            </MenuItem>
          )
        })}
      </Select>
    </StyledFormControl>
  )
}

const Parameters = ({ parameters }: { parameters: any }) => {
  const classes = useTooltipStyles()

  return (
    <p>
      <span>
        {parameters[0]}
        {parameters[2] && (
          <Tooltip title={parameters[2]} placement="right" classes={{ tooltip: classes.tooltip }} arrow>
            <img src={question} width={16} height={16} alt="?" />
          </Tooltip>
        )}
      </span>
      <span>{parameters[1]}</span>
    </p>
  )
}

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
export const PagerSwap = ({ tokens }: { tokens: TokenInfo[] }) => {
  const classes = useStyles()

  const [currentTab, setCurrentTab] = useState(0)

  const [spotQuantityFrom, setSpotQuantityFrom] = useState(0)
  const [spotCurrencyFrom, setSpotCurrencyFrom] = useState(-1)
  const [spotQuantityTo, setSpotQuantityTo] = useState(0)
  const [spotCurrencyTo, setSpotCurrencyTo] = useState(-1)

  const [marginQuantityFrom, setMarginQuantityFrom] = useState(0)
  const [marginCurrencyFrom, setMarginCurrencyFrom] = useState(-1)
  const [marginQuantityTo, setMarginQuantityTo] = useState(0)
  const [marginCurrencyTo, setMarginCurrencyTo] = useState(-1)
  const [multiplier, setMultiplier] = useState(1)

  const parameters = {
    price: ['Price ', 0.135426798],
    slippageTolerance: ['Slippage Tolerance', 8],
    minimumReceived: [
      'Minimum received',
      '0.000004014 ETH',
      'This is the text dummy data of help. text help arrives here'
    ],
    priceImpact: ['Price Impact', '0.01%', 'TODO This is the text dummy data of help. text help arrives here'],
    transactionFee: ['Transaction Fee', '0.01%', 'This is the text dummy data of help. text help arrives here'],
    route: ['Route ', 'MFI > USDC > ETH', 'This is the text dummy data of help. text help arrives here']
  }

  const middleParameters = (
    <ParametersSection>
      <Parameters parameters={parameters.price} />
      <Parameters parameters={parameters.slippageTolerance} />
    </ParametersSection>
  )

  const bottomParameters = (
    <ParametersSection>
      <Parameters parameters={parameters.minimumReceived} />
      <Parameters parameters={parameters.priceImpact} />
      <Parameters parameters={parameters.transactionFee} />
      <Parameters parameters={parameters.route} />
    </ParametersSection>
  )

  const handleChangeTab = (event: React.ChangeEvent<unknown>, newValue: number) => {
    setCurrentTab(newValue)
  }

  useEffect(() => {
    setSpotQuantityTo(spotQuantityFrom)
    setMarginQuantityTo(marginQuantityFrom * multiplier)
  }, [spotQuantityFrom, marginQuantityFrom, multiplier])

  return (
    <AppBody>
      <PagerSwapWrapper>
        <PagerSwapHeader>
          <h4>Swap</h4>
          <IconButton>
            <SettingsOutlinedIcon fontSize="small" style={{ color: 'white' }} />
          </IconButton>
        </PagerSwapHeader>
        <AppBar position="static" className={classes.root}>
          <StyledTabs
            variant="fullWidth"
            value={currentTab}
            onChange={handleChangeTab}
            aria-label="nav tabs example"
            TabIndicatorProps={{ color: 'transparent' }}
          >
            <LinkTab label="Spot" href="/#" {...applyTabProps(0)} />
            <LinkTab label="Margin" href="/#" {...applyTabProps(1)} />
          </StyledTabs>
          <TabPanel value={currentTab} index={0}>
            <div className={classes.tabPanel}>
              <StakeInput
                title="From"
                balance={0.642379}
                deal={{
                  quantity: spotQuantityFrom,
                  setQuantity: setSpotQuantityFrom,
                  currency: spotCurrencyFrom,
                  setCurrency: setSpotCurrencyFrom
                }}
                tokens={tokens}
              />
              <MidleWrapper>
                <SwapArrow
                  onClick={() => {
                    const temp = spotCurrencyFrom
                    setSpotCurrencyFrom(spotCurrencyTo)
                    setSpotCurrencyTo(temp)
                  }}
                />
              </MidleWrapper>
              <StakeInput
                title="To (estimated)"
                balance={1.314269}
                deal={{ quantity: spotQuantityTo, currency: spotCurrencyTo, setCurrency: setSpotCurrencyTo }}
                tokens={tokens}
              />
              {middleParameters}
              <div className={classes.actions}>
                <Button variant="outlined" size="large" id="spot">
                  Approve USDT
                </Button>
              </div>
              {bottomParameters}
            </div>
          </TabPanel>
          <TabPanel value={currentTab} index={1}>
            <div className={classes.tabPanel}>
              <StakeInput
                title="From"
                balance={0.642379}
                deal={{
                  quantity: marginQuantityFrom,
                  setQuantity: setMarginQuantityFrom,
                  currency: marginCurrencyFrom,
                  setCurrency: setMarginCurrencyFrom
                }}
                tokens={tokens}
              />
              <MidleWrapper>
                <span>Leverage</span>
                <MultiplierInput deal={{ multiplier, setMultiplier }} />
                <SwapArrow
                  onClick={() => {
                    const temp = marginCurrencyFrom
                    setMarginCurrencyFrom(marginCurrencyTo)
                    setMarginCurrencyTo(temp)
                  }}
                />
                <img src={walletIcon} width={16} height={15} alt="wallet" />
                <span>Borrowable: 200 USDC</span>
              </MidleWrapper>
              <StakeInput
                title="To (estimated)"
                balance={1.314269}
                deal={{ quantity: marginQuantityTo, currency: marginCurrencyTo, setCurrency: setMarginCurrencyTo }}
                tokens={tokens}
              />
              {middleParameters}
              <div className={classes.actions}>
                <Button variant="outlined" size="large" id="swap">
                  Swap
                </Button>
              </div>
              {bottomParameters}
            </div>
          </TabPanel>
        </AppBar>
      </PagerSwapWrapper>
    </AppBody>
  )
}
