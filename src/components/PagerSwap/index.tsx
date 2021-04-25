import { Button, AppBar, Tab, Tabs } from '@material-ui/core'
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward'
import { TokenInfo } from '@uniswap/token-lists'
import AppBody from 'pages/AppBody'
import { useStyles, useInputStyles } from './useStyles'
import React, { FunctionComponent, useCallback } from 'react'
import Parameters from './Parameters'
import StakeInput from './StakeInput'
import TabPanel from './TabPanel'
import { ErrorBar } from '../Placeholders'
import useSwap from './useSwap'
import SwapSettings from '../SwapSettings'
import { useSwapCallback } from '../../hooks/useSwapCallback'
import { useDerivedSwapInfo, useSwapState } from '../../state/swap/hooks'
import { MaxUint256 } from '@ethersproject/constants'
import { getContract } from '../../utils'
import ERC20_ABI from '../../constants/abis/erc20.json'
import { useWeb3React } from '@web3-react/core'
import { useActiveWeb3React } from '../../hooks'
import { TransactionResponse } from '@ethersproject/providers'
import { useTransactionAdder } from '../../state/transactions/hooks'
import { getAddresses } from '@marginswap/sdk'
const { REACT_APP_FEE_PERCENT } = process.env

const calcMinReceived = (amount: number, slippageTolerance: number) =>
  Math.round(amount * (1 - Number(REACT_APP_FEE_PERCENT) / 100) * (1 - slippageTolerance / 10000) * 1000000) / 1000000

const calcTransactionFee = (amount: number) => Math.round(amount * Number(REACT_APP_FEE_PERCENT) * 10000) / 1000000

// mock stuff, to be replaced
const calcPriceImpact = (amount: number) => Math.round(100 * Math.max(Math.log(amount) * 10, 0.01)) / 100
const route = 'MFI > USDC > ETH'

export const PagerSwap: FunctionComponent<{
  tokens: (TokenInfo & {
    balance?: number
    isSpotApproved?: boolean
    isMarginApproved?: boolean
    borrowable?: number
  })[]
  accountConnected: boolean
  exchangeRates: Record<string, number>
}> = ({ tokens, accountConnected, exchangeRates }) => {
  const classes = useStyles()
  const styles = useInputStyles()

  const {
    error,
    currentTab,
    handleChangeTab,
    getExchangeRate,
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
    handleSelectToken,
    settingsOpened,
    toggleSettings,
    expertMode,
    toggleExpertMode,
    slippageTolerance,
    setSlippageTolerance,
    transactionDeadline,
    setTransactionDeadline,
    singleHopOnly,
    setSingleHopOnly
  } = useSwap({ tokens, accountConnected, exchangeRates })

  const middleParameters = (
    <div className={classes.parameters + ' ' + classes.fullWidthPair}>
      {((currentTab === 0 && spotCurrencyFrom !== null && spotCurrencyTo !== null) ||
        (currentTab === 1 && marginCurrencyFrom !== null && marginCurrencyTo !== null)) &&
        !error && (
          <Parameters
            title="Price"
            value={getExchangeRate(
              currentTab === 0 ? tokens[spotCurrencyFrom!].symbol : tokens[marginCurrencyFrom!].symbol,
              currentTab === 0 ? tokens[spotCurrencyTo!].symbol : tokens[marginCurrencyTo!].symbol
            )}
          />
        )}
      <Parameters title="Slippage tolerance" value={`${slippageTolerance / 100}%`} />
    </div>
  )

  const bottomParameters =
    ((currentTab === 0 && Number(spotQuantityTo) > 0 && spotCurrencyTo !== null && spotCurrencyFrom !== null) ||
      (currentTab === 1 && Number(marginQuantityTo) > 0 && marginCurrencyTo !== null && marginCurrencyFrom !== null)) &&
    !error ? (
      <div className={classes.parameters + ' ' + classes.fullWidthPair}>
        <Parameters
          title="Minimum received"
          value={`${calcMinReceived(
            currentTab === 0 ? Number(spotQuantityTo) : Number(marginQuantityTo),
            slippageTolerance
          )} ${tokens[currentTab === 0 ? spotCurrencyTo! : marginCurrencyTo!].symbol}`}
          hint="Your transaction will revert if there is a large, unfavorable price movement before it is confirmed"
        />
        <Parameters
          title="Price impact"
          value={`${calcPriceImpact(currentTab === 0 ? Number(spotQuantityFrom) : Number(marginQuantityFrom))} %`}
          hint="The difference between the market price and estimated price due to trade size"
        />
        <Parameters
          title="Transaction Fee"
          value={`${calcTransactionFee(currentTab === 0 ? Number(spotQuantityFrom) : Number(marginQuantityFrom))} ${
            tokens[currentTab === 0 ? spotCurrencyFrom! : marginCurrencyFrom!].symbol
          }`}
          hint={`A portion of each trade (${REACT_APP_FEE_PERCENT}%) goes to liquidity providers as a protocol incentive`}
        />
        {!singleHopOnly && <Parameters title="Route" value={route} hint="Mock stuff!" />}
      </div>
    ) : null

  const { account, chainId } = useWeb3React()
  const { library } = useActiveWeb3React()

  const addTransaction = useTransactionAdder()

  const { trade } = useDerivedSwapInfo()
  // swap state
  const { recipient } = useSwapState()

  // the callback to execute the swap
  // TODO the following is incorrect, to just set it (marginTrade) to true
  // TODO - the last argument of 0 needs to be changed to the correct maxMarginTrade number as it is in the swap page
  const { callback: swapCallback } = useSwapCallback(trade, true, slippageTolerance, recipient, '0')

  const handleSwap = useCallback(() => {
    if (!swapCallback) {
      return
    }
    console.log('swap start')
    swapCallback()
      .then(hash => {
        console.log('swap hash :>> ', hash)
        console.log('swap end')
      })
      .catch(error => {
        console.log('swap error :>> ', error)
        console.log('swap end')
      })
  }, [swapCallback, singleHopOnly])

  const handleApprove = (address: string, isSpot: boolean) => {
    if (!address || !library || !account) return
    const tokenContract = getContract(address, ERC20_ABI, library, account)

    if (!tokenContract) {
      console.error('tokenContract is null')
      return
    }

    if (chainId) {
      const addressToApprove = isSpot ? getAddresses(chainId).SpotRouter : getAddresses(chainId).Fund
      tokenContract
        .approve(addressToApprove, MaxUint256)
        .then((response: TransactionResponse) => {
          addTransaction(response, {
            summary: `Approve Success`
          })
        })
        .catch((error: Error) => {
          console.debug('Failed to approve', error)
          throw error
        })
    }
  }

  return (
    <AppBody>
      {error && <ErrorBar>{error}</ErrorBar>}
      <div className={classes.wrapper}>
        <div className={classes.header}>
          <h4>Swap</h4>
          <SwapSettings
            isOpened={settingsOpened}
            toggleOpened={toggleSettings}
            slippageTolerance={slippageTolerance}
            setSlippageTolerance={setSlippageTolerance}
            deadline={transactionDeadline}
            setDeadline={setTransactionDeadline}
            singleHopOnly={singleHopOnly}
            setSingleHopOnly={setSingleHopOnly}
            expertMode={expertMode}
            toggleExpertMode={toggleExpertMode}
          />
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
                {spotCurrencyFrom !== null && !tokens[spotCurrencyFrom].isSpotApproved ? (
                  <Button
                    variant="outlined"
                    size="large"
                    id="spot"
                    onClick={() => handleApprove(tokens[spotCurrencyFrom].address, true)}
                  >
                    {`Approve ${tokens[spotCurrencyFrom].symbol}`}
                  </Button>
                ) : (
                  <Button
                    variant="outlined"
                    size="large"
                    id="spot"
                    disabled={!!getButtonDisabledStatus()}
                    onClick={handleSwap}
                  >
                    {/* TODO: is approved? */}
                    {getButtonDisabledStatus() ?? 'Swap'}
                  </Button>
                )}
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
                isMargin
              />
              <div className={styles.middleWrapper}>
                {marginCurrencyFrom !== null &&
                  tokens[marginCurrencyFrom].balance !== undefined &&
                  tokens[marginCurrencyFrom].borrowable !== undefined &&
                  tokens[marginCurrencyFrom].borrowable! > 0 && (
                    <span>
                      Leverage:{' '}
                      {Math.round(
                        (Math.max(Number(marginQuantityFrom) - tokens[marginCurrencyFrom].balance!, 0) * 10000) /
                          tokens[marginCurrencyFrom].borrowable!
                      ) / 100}
                      %
                    </span>
                  )}
                <ArrowDownwardIcon onClick={replaceCurrencies} />
                {marginCurrencyFrom !== null && tokens[marginCurrencyFrom].borrowable !== undefined && (
                  <span>
                    Borrowable: {tokens[marginCurrencyFrom].borrowable} {tokens[marginCurrencyFrom].symbol}
                  </span>
                )}
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
                {spotCurrencyFrom !== null && !tokens[spotCurrencyFrom].isMarginApproved ? (
                  <Button
                    variant="outlined"
                    size="large"
                    id="spot"
                    onClick={() => handleApprove(tokens[spotCurrencyFrom].address, false)}
                  >
                    {`Approve ${tokens[spotCurrencyFrom].symbol}`}
                  </Button>
                ) : (
                  <Button variant="outlined" size="large" id="swap" disabled={!!getButtonDisabledStatus()}>
                    {getButtonDisabledStatus() ?? 'Swap'}
                  </Button>
                )}
              </div>
              {bottomParameters}
            </div>
          </TabPanel>
        </AppBar>
      </div>
    </AppBody>
  )
}
