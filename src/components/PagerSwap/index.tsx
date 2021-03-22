import { Box, Button, IconButton } from '@material-ui/core'
import AppBar from '@material-ui/core/AppBar'
import FormControl from '@material-ui/core/FormControl'
import { Select, MenuItem } from '@material-ui/core'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward'
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined'
import { TokenInfo } from '@uniswap/token-lists'
import AppBody from 'pages/AppBody'
import { CurrencyModal } from '../CurrencyModal/index'
import { useStyles, useInputStyles } from './useStyles'
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
  const styles = useStyles()

  const handleChange = (event: any) => {
    if (!deal.setQuantity) return
    deal.setQuantity(event.target.value)
  }

  const handleSetMax = () => {
    if (!deal.setQuantity) return
    deal.setQuantity(balance)
  }

  return (
    <div className={classes.wrapper + ' ' + styles.fullWidthPair}>
      <p>
        <span>{title}</span>
        <span>Balance: {balance}</span>
      </p>
      <div className={classes.input}>
        <input type="number" value={deal.quantity} min={0} onChange={event => handleChange(event)} className="value" />
        {deal.setQuantity && (
          <Button variant="text" size="small" className={classes.maxButton} onClick={handleSetMax}>
            MAX
          </Button>
        )}
        <div className={classes.currencyWrapper}>
          {tokens && (
            <>
              <CurrencyModal tokens={tokens} deal={{ currency: deal.currency, setCurrency: deal.setCurrency }} />
            </>
          )}
        </div>
      </div>
    </div>
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
    <FormControl className={classes.formControl}>
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
    </FormControl>
  )
}

const TradeParameters = ({ price, slippageTolerance }: { price: number; slippageTolerance: number }) => {
  return (
    <>
      <p>
        <span>Price</span> <span>{price}</span>
      </p>
      <p>
        <span>Slippage Tolerance</span> <span>{slippageTolerance}%</span>
      </p>
    </>
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
  const styles = useInputStyles()

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

  const handleChangeTab = (event: React.ChangeEvent<Record<string, unknown>>, newValue: number) => {
    setCurrentTab(newValue)
  }

  useEffect(() => {
    setSpotQuantityTo(spotQuantityFrom)
    setMarginQuantityTo(marginQuantityFrom * multiplier)
  }, [spotQuantityFrom, marginQuantityFrom, multiplier])

  return (
    <AppBody>
      <div className={classes.wrapper}>
        <div className={classes.header}>
          <h4>Swap</h4>
          <IconButton>
            <SettingsOutlinedIcon fontSize="small" style={{ color: 'white' }} />
          </IconButton>
        </div>
        <AppBar position="static" className={classes.root}>
          <Tabs
            variant="fullWidth"
            value={currentTab}
            onChange={handleChangeTab}
            aria-label="nav tabs example"
            className={classes.tabs}
            TabIndicatorProps={{ color: 'transparent' }}
          >
            <LinkTab label="Spot" href="/#" {...applyTabProps(0)} />
            <LinkTab label="Margin" href="/#" {...applyTabProps(1)} />
          </Tabs>
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
              <div className={styles.midleWrapper}>
                <ArrowDownwardIcon
                  className={styles.swapArrow}
                  onClick={() => {
                    const temp = spotCurrencyFrom
                    setSpotCurrencyFrom(spotCurrencyTo)
                    setSpotCurrencyTo(temp)
                  }}
                />
              </div>
              <StakeInput
                title="To (estimated)"
                balance={1.314269}
                deal={{ quantity: spotQuantityTo, currency: spotCurrencyTo, setCurrency: setSpotCurrencyTo }}
                tokens={tokens}
              />
              <div className={classes.parameters + ' ' + classes.fullWidthPair}>
                <TradeParameters price={0.135426798} slippageTolerance={8} />
              </div>
              <div className={classes.actions}>
                <Button variant="outlined" size="large" id="spot">
                  Approve USDT
                </Button>
              </div>
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
              <div className={styles.midleWrapper}>
                <span>Leverage</span>
                <MultiplierInput deal={{ multiplier, setMultiplier }} />
                <ArrowDownwardIcon
                  className={styles.swapArrow}
                  onClick={() => {
                    const temp = marginCurrencyFrom
                    setMarginCurrencyFrom(marginCurrencyTo)
                    setMarginCurrencyTo(temp)
                  }}
                />
                <span>Borrowable: 200 USDC</span>
              </div>
              <StakeInput
                title="To (estimated)"
                balance={1.314269}
                deal={{ quantity: marginQuantityTo, currency: marginCurrencyTo, setCurrency: setMarginCurrencyTo }}
                tokens={tokens}
              />
              <div className={classes.parameters + ' ' + classes.fullWidthPair}>
                <TradeParameters price={0.135426798} slippageTolerance={8} />
              </div>
              <div className={classes.actions}>
                <Button variant="outlined" size="large" id="swap">
                  Swap
                </Button>
              </div>
            </div>
          </TabPanel>
        </AppBar>
      </div>
    </AppBody>
  )
}
