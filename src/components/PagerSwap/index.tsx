import { Box, Button, IconButton, makeStyles, Theme } from '@material-ui/core'
import AppBar from '@material-ui/core/AppBar'
import FormControl from '@material-ui/core/FormControl'
import { Select, MenuItem } from '@material-ui/core'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
import { SwapHoriz } from '@material-ui/icons'
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward'
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined'
import XIcon from '../../assets/images/x.svg'
import { TokenInfo } from '@uniswap/token-lists'
import AppBody from 'pages/AppBody'
import Modal from '@material-ui/core/Modal'
import Backdrop from '@material-ui/core/Backdrop'
import Fade from '@material-ui/core/Fade'
import React, { FC, useEffect, useState } from 'react'

const useStyles = makeStyles((theme: Theme) => ({
  wrapper: {
    backgroundColor: 'initial',
    background: 'rgba(50, 50, 50, 0.25)',
    backdropFilter: 'blur(10px)',
    borderRadius: 20,
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
    padding: '12px',
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
const useInputStyles = makeStyles(theme => ({
  wrapper: {
    borderRadius: '10px',
    border: '1px solid lightgray',
    padding: '12px 18px',
    fontSize: 14,
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
    width: '50%',
    minWidth: 70,
    paddingLeft: '12px',
    '& .MuiInputBase-root': {
      color: '#fff'
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

interface CurrencyInput {
  tokens: TokenInfo[]
  deal: {
    currency: number
    setCurrency: React.Dispatch<React.SetStateAction<number>>
  }
}

const useModalStyles = makeStyles((theme: Theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  paper: {
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
    '& #select': {
      height: '28px',
      background: '#4255FF',
      borderRadius: '19px'
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
      filter: 'invert()'
    }
  },
  currencyList: {
    height: '380px',
    overflowY: 'auto'
  },
  currency: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    gap: '10px'
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
    color: 'inherit'
  }
}))

const CurrencyModal: FC<CurrencyInput> = ({ tokens, deal }: CurrencyInput) => {
  const classes = useModalStyles()

  const [open, setOpen] = React.useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

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

  return (
    <div>
      <button type="button" onClick={handleOpen} className={classes.modalButton}>
        {deal.currency !== -1 && newTokens ? (
          <>
            <img
              src={newTokens[deal.currency]?.logoURI}
              alt={newTokens[deal.currency]?.chainId.toString()}
              className={classes.currencyImg}
            />
            <span>{newTokens[deal.currency]?.symbol}</span>
          </>
        ) : (
          <span id="select">Select Token</span>
        )}
      </button>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <div className={classes.modalHeader}>
              <h3>Select a token</h3>
              <img src={XIcon} width="20px" height="20px" alt="X" onClick={handleClose} />
            </div>
            <div className={classes.currencyList}>
              {newTokens &&
                newTokens.map((token, index) => {
                  return (
                    <div key={index} className={classes.currency} onClick={() => deal.setCurrency(index)}>
                      <img src={token?.logoURI} alt={token?.chainId.toString()} className={classes.currencyImg} />
                      <span>{token.symbol}</span>
                    </div>
                  )
                })}
            </div>
            <button className={classes.modalConfirm} onClick={handleClose}>
              Manage
            </button>
          </div>
        </Fade>
      </Modal>
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
  const [spotCurrencyFrom, setSpotCurrencyFrom] = useState(-1)
  const [spotQuantityTo, setSpotQuantityTo] = useState(0)
  const [spotCurrencyTo, setSpotCurrencyTo] = useState(-1)

  const [marginQuantityFrom, setMarginQuantityFrom] = useState(0)
  const [marginCurrencyFrom, setMarginCurrencyFrom] = useState(-1)
  const [marginQuantityTo, setMarginQuantityTo] = useState(0)
  const [marginCurrencyTo, setMarginCurrencyTo] = useState(-1)
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
