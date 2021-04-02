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
import React, { FunctionComponent } from 'react'
import Parameters from './Parameters'
import StakeInput from './StakeInput'
import TabPanel from './TabPanel'
import { ErrorBar } from '../Placeholders'
import useSwap from './useSwap'

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
  tokens: (TokenInfo & { balance?: number; borrowable?: number })[]
  accountConnected: boolean
  exchangeRates: Record<string, number>
}> = ({ tokens, accountConnected, exchangeRates }) => {
  const classes = useStyles()
  const styles = useInputStyles()

  const {
    error,
    currentTab,
    handleChangeTab,
    spotQuantityFrom,
    spotQuantityTo,
    spotCurrencyFrom,
    spotCurrencyTo,
    marginQuantityFrom,
    marginQuantityTo,
    marginCurrencyFrom,
    marginCurrencyTo,
    replaceCurrencies,
    getButtonDisabledStatus,
    handleAmountChange,
    handleSelectToken
  } = useSwap({ tokens, accountConnected, exchangeRates })

  // mock stuff
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

  return (
    <AppBody>
      {error && <ErrorBar>{error}</ErrorBar>}
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
          >
            <Tab label="Spot" id="nav-tab-0" aria-controls="nav-tabpanel-0" />
            <Tab label="Margin" id="nav-tab-1" aria-controls="nav-tabpanel-1" />
          </Tabs>
          <TabPanel activeIndex={currentTab} index={0}>
            <div className={classes.tabPanel}>
              <StakeInput
                title="From"
                quantity={spotQuantityFrom}
                setQuantity={amount => handleAmountChange(amount, true, true)}
                selectedTokenIndex={spotCurrencyFrom}
                hiddenTokenIndex={spotCurrencyTo}
                selectToken={tokenIndex => {
                  handleSelectToken(tokenIndex, true, true)
                }}
                tokens={tokens}
                renderMax={accountConnected}
              />
              <div className={styles.middleWrapper}>
                <ArrowDownwardIcon className={styles.swapArrow} onClick={replaceCurrencies} />
              </div>
              <StakeInput
                title="To (estimated)"
                quantity={spotQuantityTo}
                setQuantity={amount => handleAmountChange(amount, false, true)}
                selectedTokenIndex={spotCurrencyTo}
                hiddenTokenIndex={spotCurrencyFrom}
                selectToken={tokenIndex => {
                  handleSelectToken(tokenIndex, false, true)
                }}
                tokens={tokens}
              />
              {middleParameters}
              <div className={classes.actions}>
                <Button variant="outlined" size="large" id="spot" disabled={!!getButtonDisabledStatus()}>
                  {/* TODO: is approved? */}
                  {getButtonDisabledStatus() ?? 'Swap'}
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
                setQuantity={amount => handleAmountChange(amount, true, false)}
                selectedTokenIndex={marginCurrencyFrom}
                hiddenTokenIndex={marginCurrencyTo}
                selectToken={tokenIndex => {
                  handleSelectToken(tokenIndex, true, false)
                }}
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
                setQuantity={amount => handleAmountChange(amount, false, false)}
                selectedTokenIndex={marginCurrencyTo}
                hiddenTokenIndex={marginCurrencyFrom}
                selectToken={tokenIndex => {
                  handleSelectToken(tokenIndex, false, false)
                }}
                tokens={tokens}
              />
              {middleParameters}
              <div className={classes.actions}>
                <Button variant="outlined" size="large" id="swap" disabled={!!getButtonDisabledStatus()}>
                  {getButtonDisabledStatus() ?? 'Swap'}
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
