import { Box, Button, IconButton, makeStyles, Theme } from '@material-ui/core'
import AppBar from '@material-ui/core/AppBar'
import FormControl from '@material-ui/core/FormControl'
import { Select, MenuItem } from '@material-ui/core'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
import { SwapHoriz } from '@material-ui/icons'
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward'
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined'
import { TokenInfo } from '@uniswap/token-lists'
import AppBody from 'pages/AppBody'
import React, { FC, useEffect, useState } from 'react'
const useStyles = makeStyles((theme: Theme) => ({
  wrapper: {
    backgroundColor: '#2c2c5b',
    borderRadius: 20,
    margin: 'auto',
    color: 'white',
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
      fontWeight: '900',
      fontSize: '1.1em',
      lineHeight: '1.1'
    }
  },
  fullWidthPair: {
    '& p > span:nth-child(odd)': {
      float: 'left'
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
    height: '74px',
    display: 'flex',
    flexDirection: 'column',
    padding: '0 28px',
    justifyContent: 'space-evenly'
  },
  actions: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
    margin: 'auto 0 18px 0',
    '& .MuiButtonBase-root': {
      backgroundColor: 'white',
      textTransform: 'none',
      color: '#2c2c5b',
      borderRadius: 20,
      width: '48%',
      fontWeight: 700,
      fontSize: '16px',
      lineHeight: '24px'
    }
  },
  settings: {
    padding: '12px',
    width: '40px',
    height: '40px',
    margin: 'auto 0',
    position: 'relative',
    right: '-10px'
  },
  root: {
    backgroundColor: theme.palette.background.paper,
    borderRadius: '20px',
    height: 285
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
        '&[aria-controls=nav-tabpanel-1]': {
          borderRightWidth: '0px'
        }
      },
      '&[aria-selected=false]': {
        borderBottomWidth: '1px',
        borderBottomStyle: 'solid'
      }
    }
  }
}))
const useInputStyles = makeStyles(theme => ({
  wrapper: {
    borderRadius: '26px',
    border: '1px solid lightgray',
    padding: '12px 18px',
    color: '#2c2c5b',
    fontSize: 14,
    margin: '6px 0',
    fontWeight: 600
  },
  midleWrapper: {
    height: 32,
    display: 'flex',
    alignItems: 'center'
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
      color: '#2c2c5b',
      fontFamily: 'sans-serif',
      MozAppearance: 'textfield'
    }
  },
  button: {
    backgroundColor: '#eff3f5',
    maxHeight: 30,
    fontWeight: 700,
    letterSpacing: '0.085em'
  },
  formControl: {
    display: 'inline-block',
    width: '50%',
    minWidth: 70,
    paddingLeft: '12px'
  },
  selectEmpty: {
    marginTop: 0,
    color: '#2c2c5b',
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
    alignItems: 'center'
  },
  swapArrow: {
    color: '#2c2c5b',
    position: 'absolute',
    left: '46.5%'
  }
}))

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

  const handleSetMax = (event: any) => {
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
          <Button variant="text" size="small" className={classes.button} onClick={handleSetMax}>
            MAX
          </Button>
        )}
        <div className={classes.currencyWrapper}>
          {tokens && (
            <CurrencyInput tokens={tokens} deal={{ currency: deal.currency, setCurrency: deal.setCurrency }} />
          )}
        </div>
      </div>
    </div>
  )
}

interface CurrencyInput {
  tokens: TokenInfo[]
  deal: {
    currency: number
    setCurrency: React.Dispatch<React.SetStateAction<number>>
  }
}

const CurrencyInput: FC<CurrencyInput> = ({ tokens, deal }: CurrencyInput) => {
  const classes = useInputStyles()
  const [newTokens, setNewTokens] = useState<TokenInfo[]>([])

  useEffect(() => {
    const unique: string[] = []
    const tempTokens = tokens.filter(({ symbol, logoURI }: any) => {
      if (!unique.includes(symbol) && logoURI) {
        unique.push(symbol)
        return true
      }
      return false
    })
    setNewTokens(tempTokens)
  }, [tokens])

  const handleChangeCurrency = (event: any) => {
    deal.setCurrency(event.target.value)
  }

  return (
    <Select
      value={deal.currency}
      onChange={handleChangeCurrency}
      name="age"
      className={classes.selectEmpty}
      inputProps={{ 'aria-label': 'age' }}
    >
      {newTokens &&
        newTokens.map((token, index) => {
          return (
            <MenuItem key={index} value={index}>
              <img src={token?.logoURI} alt={token?.chainId.toString()} className={classes.currencyImg} />
              <span>{token.symbol}</span>
            </MenuItem>
          )
        })}
    </Select>
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
        <SwapHoriz fontSize="small" />
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
  const [spotCurrencyFrom, setSpotCurrencyFrom] = useState(1)
  const [spotQuantityTo, setSpotQuantityTo] = useState(0)
  const [spotCurrencyTo, setSpotCurrencyTo] = useState(3)

  const [marginQuantityFrom, setMarginQuantityFrom] = useState(0)
  const [marginCurrencyFrom, setMarginCurrencyFrom] = useState(1)
  const [marginQuantityTo, setMarginQuantityTo] = useState(0)
  const [marginCurrencyTo, setMarginCurrencyTo] = useState(3)
  const [multiplier, setMultiplier] = useState(1)

  const handleChangeTab = (event: React.ChangeEvent<{}>, newValue: number) => {
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
          </TabPanel>
          <TabPanel value={currentTab} index={1}>
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
              <MultiplierInput deal={{ multiplier, setMultiplier }} />
              <ArrowDownwardIcon
                className={styles.swapArrow}
                onClick={() => {
                  const temp = marginCurrencyFrom
                  setMarginCurrencyFrom(marginCurrencyTo)
                  setMarginCurrencyTo(temp)
                }}
              />
            </div>
            <StakeInput
              title="To (estimated)"
              balance={1.314269}
              deal={{ quantity: marginQuantityTo, currency: marginCurrencyTo, setCurrency: setMarginCurrencyTo }}
              tokens={tokens}
            />
          </TabPanel>
        </AppBar>
        <div className={classes.parameters + ' ' + classes.fullWidthPair}>
          <TradeParameters price={0.135426798} slippageTolerance={8} />
        </div>
        <div className={classes.actions}>
          <Button variant="outlined" size="large">
            Approve
          </Button>
          <Button variant="outlined" size="large">
            Swap
          </Button>
        </div>
      </div>
    </AppBody>
  )
}
