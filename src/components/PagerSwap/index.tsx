import { Button, IconButton } from '@material-ui/core'
import AppBar from '@material-ui/core/AppBar'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward'
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined'
import walletIcon from 'assets/svg/walletIcon.svg'
import { TokenInfo } from '@uniswap/token-lists'
import AppBody from 'pages/AppBody'
import { useStyles, useInputStyles } from './useStyles'
import React, { ChangeEvent, FunctionComponent, useState } from 'react'
import Parameters from './Parameters'
import StakeInput from './StakeInput'
import TabPanel from './TabPanel'

// mock stuff, to be replaced
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

export const PagerSwap: FunctionComponent<{
  tokens: (TokenInfo & { balance?: number })[]
  accountConnected: boolean
}> = ({ tokens, accountConnected }) => {
  const classes = useStyles()
  const styles = useInputStyles()

  const [currentTab, setCurrentTab] = useState(0)

  const [spotQuantityFrom, setSpotQuantityFrom] = useState('0')
  const [spotCurrencyFrom, setSpotCurrencyFrom] = useState<number | null>(null)
  const [spotQuantityTo, setSpotQuantityTo] = useState('0')
  const [spotCurrencyTo, setSpotCurrencyTo] = useState<number | null>(null)

  const [marginQuantityFrom, setMarginQuantityFrom] = useState('0')
  const [marginCurrencyFrom, setMarginCurrencyFrom] = useState<number | null>(null)
  const [marginQuantityTo, setMarginQuantityTo] = useState('0')
  const [marginCurrencyTo, setMarginCurrencyTo] = useState<number | null>(null)

  const middleParameters = (
    <div className={classes.parameters + ' ' + classes.fullWidthPair}>
      <Parameters parameters={parameters.price} />
      <Parameters parameters={parameters.slippageTolerance} />
    </div>
  )

  const bottomParameters = (
    <div className={classes.parameters + ' ' + classes.fullWidthPair}>
      <Parameters parameters={parameters.minimumReceived} />
      <Parameters parameters={parameters.priceImpact} />
      <Parameters parameters={parameters.transactionFee} />
      <Parameters parameters={parameters.route} />
    </div>
  )

  const handleChangeTab = (event: ChangeEvent<unknown>, newValue: number) => {
    setCurrentTab(newValue)
  }

  const replaceCurrencies = () => {
    if (currentTab === 0) {
      const prevCurrencyFrom = spotCurrencyFrom
      setSpotCurrencyFrom(spotCurrencyTo)
      setSpotCurrencyTo(prevCurrencyFrom)
      const prevQuantityFrom = spotQuantityFrom
      setSpotQuantityFrom(spotQuantityTo)
      setSpotQuantityTo(prevQuantityFrom)
    } else {
      const prevCurrencyFrom = marginCurrencyFrom
      setMarginCurrencyFrom(marginCurrencyTo)
      setMarginCurrencyTo(prevCurrencyFrom)
      const prevQuantityFrom = marginQuantityFrom
      setMarginQuantityFrom(marginQuantityTo)
      setMarginQuantityTo(prevQuantityFrom)
    }
  }

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
            <Tab label="Spot" id="nav-tab-0" aria-controls="nav-tabpanel-0" />
            <Tab label="Margin" id="nav-tab-1" aria-controls="nav-tabpanel-1" />
          </Tabs>
          <TabPanel activeIndex={currentTab} index={0}>
            <div className={classes.tabPanel}>
              <StakeInput
                title="From"
                quantity={spotQuantityFrom}
                setQuantity={setSpotQuantityFrom}
                selectedTokenIndex={spotCurrencyFrom}
                selectToken={setSpotCurrencyFrom}
                tokens={tokens}
                renderMax={accountConnected}
              />
              <div className={styles.middleWrapper}>
                <ArrowDownwardIcon className={styles.swapArrow} onClick={replaceCurrencies} />
              </div>
              <StakeInput
                title="To (estimated)"
                quantity={spotQuantityTo}
                setQuantity={setSpotQuantityTo}
                selectedTokenIndex={spotCurrencyTo}
                selectToken={setSpotCurrencyTo}
                tokens={tokens}
              />
              {middleParameters}
              <div className={classes.actions}>
                <Button variant="outlined" size="large" id="spot">
                  {/* TODO: is approved? */}
                  Swap
                </Button>
              </div>
              {bottomParameters}
            </div>
          </TabPanel>
          <TabPanel activeIndex={currentTab} index={1}>
            <div className={classes.tabPanel}>
              <StakeInput
                title="From"
                quantity={marginQuantityFrom}
                setQuantity={setMarginQuantityFrom}
                selectedTokenIndex={marginCurrencyFrom}
                selectToken={setMarginCurrencyFrom}
                tokens={tokens}
                renderMax={accountConnected}
              />
              <div className={styles.middleWrapper}>
                <span>Leverage</span>
                {/* TODO: multiplier */}
                {/*<MultiplierInput deal={{ multiplier, setMultiplier }} />*/}
                <ArrowDownwardIcon onClick={replaceCurrencies} />
                <img src={walletIcon} width={16} height={15} alt="wallet" />
                {/* TODO */}
                <span>Borrowable: 200 USDC</span>
              </div>
              <StakeInput
                title="To (estimated)"
                quantity={marginQuantityTo}
                setQuantity={setMarginQuantityTo}
                selectedTokenIndex={marginCurrencyTo}
                selectToken={setMarginCurrencyTo}
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
      </div>
    </AppBody>
  )
}
