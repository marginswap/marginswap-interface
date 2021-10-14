import React, { useCallback, useContext, useEffect, useState } from 'react'
import AdvancedSwapDetailsDropdown from '../../components/swap/AdvancedSwapDetailsDropdown'
import UnsupportedCurrencyFooter from 'components/swap/UnsupportedCurrencyFooter'
import ReactGA from 'react-ga'
import Column from '../../components/Column'
import ProgressSteps from '../../components/ProgressSteps'
import Circle from '../../assets/images/blue-loader.svg'
import Loader from '../../components/Loader'
import useWrapCallback, { WrapType } from '../../hooks/useWrapCallback'
import useENSAddress from '../../hooks/useENSAddress'
import TradePrice from 'components/swap/TradePrice'
import ConfirmSwapModal from '../../components/swap/ConfirmSwapModal'
import confirmPriceImpactWithoutFee from '../../components/swap/confirmPriceImpactWithoutFee'
import Settings from '../Settings'

import { ProUIContext } from 'pages/Pro'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../state/index'
import { Field, selectCurrency } from '../../state/swap/actions'
import { ThemeContext } from 'styled-components'
import { useIsTransactionUnsupported } from 'hooks/Trades'
import { CustomLightSpinner } from '../../theme'
import { ApprovalState, useApproveCallbackFromTrade } from '../../hooks/useApproveCallback'
import { useExpertModeManager, useUserSlippageTolerance, useUserSingleHopOnly } from '../../state/user/hooks'
import { computeTradePriceBreakdown, warningSeverity } from '../../utils/prices'
import { useWalletModalToggle } from '../../state/application/hooks'
import { AutoRow } from '../../components/Row'
import { Container, SettingsContainer, BottomGrouping } from './OrderWidget.styles'
import { SwapCallbackError } from '../../components/swap/styleds'
import { CurrencyAmount, JSBI, LeverageType, Trade } from '@marginswap/sdk'
import { maxAmountSpend } from '../../utils/maxAmountSpend'
import { RowBetween } from 'components/Row'
import { Text } from 'rebass'
import { useActiveWeb3React } from '../../hooks'
import { useLendingAvailable } from '../../state/wallet/hooks'
import { getProviderOrSigner } from '../../utils'
import { useMarginSwapTokenList } from '../../state/lists/hooks'
import { FlatToggleOption, ToggleOption, ToggleWrapper } from 'components/ToggleButtonGroup/ToggleButtonGroup.styles'
import { ButtonError, ButtonLight, ButtonPrimary, ButtonConfirmed } from '../../components/Button'
import { GreyCard } from '../../components/Card'
import { useSwapCallback } from '../../hooks/useSwapCallback'
import {
  useDefaultsFromURLSearch,
  useDerivedSwapInfo,
  useSwapActionHandlers,
  useSwapState
} from '../../state/swap/hooks'
import CurrencyStyledInput from 'components/CurrencyStyledInput'

enum OrderType {
  BUY,
  SELL
}

const OrderWidget = () => {
  const loadedUrlParams = useDefaultsFromURLSearch()
  const theme = useContext(ThemeContext)
  const { library, account, chainId } = useActiveWeb3React()
  const {
    trade,
    currencyBalances,
    marginAccountBalances,
    parsedAmount,
    currencies,
    inputError: swapInputError
  } = useDerivedSwapInfo()

  let provider: any
  if (library && account) {
    provider = getProviderOrSigner(library, account)
  }
  const currencySymbol = currencies[Field.INPUT]?.symbol
  const tokenList = useMarginSwapTokenList(chainId)
  const token = tokenList.find(t => t.symbol === currencySymbol)
  const lendingAvailable = useLendingAvailable(chainId, token, provider)
  const dispatch = useDispatch<AppDispatch>()
  const { currentPair } = useContext(ProUIContext)
  const [orderType, setOrderType] = useState(OrderType.BUY)
  const [showInverted, setShowInverted] = useState<boolean>(false)
  const { independentField, typedValue, recipient, leverageType } = useSwapState()
  const [isExpertMode] = useExpertModeManager()
  const { address: recipientAddress } = useENSAddress(recipient)

  const {
    wrapType,
    execute: onWrap,
    inputError: wrapInputError
  } = useWrapCallback(currencies[Field.INPUT], currencies[Field.OUTPUT], typedValue)

  const [tradeLoading, setTradeLoading] = useState<{
    isLoading: boolean
    timeout: ReturnType<typeof setTimeout> | undefined
  }>({ isLoading: false, timeout: undefined })

  const { onSwitchTokens, onUserInput, onSwitchLeverageType } = useSwapActionHandlers()

  const maxAmountInput: CurrencyAmount | undefined = maxAmountSpend(
    currencyBalances[Field.INPUT],
    lendingAvailable,
    marginAccountBalances[Field.INPUT]
  )

  const swapIsUnsupported = useIsTransactionUnsupported(currencies?.INPUT, currencies?.OUTPUT)
  const showWrap: boolean = wrapType !== WrapType.NOT_APPLICABLE
  const parsedAmounts = showWrap
    ? {
        [Field.INPUT]: parsedAmount,
        [Field.OUTPUT]: parsedAmount
      }
    : {
        [Field.INPUT]: independentField === Field.INPUT ? parsedAmount : trade?.inputAmount,
        [Field.OUTPUT]: independentField === Field.OUTPUT ? parsedAmount : trade?.outputAmount
      }

  const dependentField: Field = independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT
  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: showWrap
      ? parsedAmounts[independentField]?.toExact() ?? ''
      : parsedAmounts[dependentField]?.toSignificant(6) ?? ''
  }

  const route = trade?.route
  const userHasSpecifiedInputOutput = Boolean(
    currencies[Field.INPUT] && currencies[Field.OUTPUT] && parsedAmounts[independentField]?.greaterThan(JSBI.BigInt(0))
  )
  const noRoute = !route

  const toggleWalletModal = useWalletModalToggle()
  const [singleHopOnly] = useUserSingleHopOnly()

  // modal and loading
  const [{ showConfirm, tradeToConfirm, swapErrorMessage, attemptingTxn, txHash }, setSwapState] = useState<{
    showConfirm: boolean
    tradeToConfirm: Trade | undefined
    attemptingTxn: boolean
    swapErrorMessage: string | undefined
    txHash: string | undefined
  }>({
    showConfirm: false,
    tradeToConfirm: undefined,
    attemptingTxn: false,
    swapErrorMessage: undefined,
    txHash: undefined
  })

  // get custom setting values for user
  const [allowedSlippage] = useUserSlippageTolerance()

  // check whether the user has approved the router on the input token
  const [approval, approveCallback] = useApproveCallbackFromTrade(trade, allowedSlippage, leverageType)

  // check if user has gone through approval process, used to show two step buttons, reset on token change
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)

  // mark when a user has submitted an approval, reset onTokenSelection for input field
  useEffect(() => {
    if (approval === ApprovalState.PENDING) {
      setApprovalSubmitted(true)
    }
  }, [approval, approvalSubmitted])

  useEffect(() => {
    const currencyAddress1: string = currentPair && currentPair[0].address ? currentPair[0].address : 'ETH'
    const currencyAddress2: string = currentPair && currentPair[1].address ? currentPair[1].address : 'ETH'

    dispatch(
      selectCurrency({
        field: Field.INPUT,
        currencyId: currencyAddress1
      })
    )

    dispatch(
      selectCurrency({
        field: Field.OUTPUT,
        currencyId: currencyAddress2
      })
    )
  }, [currentPair, loadedUrlParams])

  const handleChangeOrderType = (orderType: OrderType) => {
    setApprovalSubmitted(false)
    setOrderType(orderType)
    onSwitchTokens()
  }

  useEffect(() => {
    const { isLoading, timeout } = tradeLoading
    if (noRoute && userHasSpecifiedInputOutput && !isLoading && !timeout) {
      const timeout = setTimeout(() => setTradeLoading({ isLoading: false, timeout: undefined }), 60 * 1000)
      setTradeLoading({
        isLoading: true,
        timeout
      })
    }
  }, [noRoute, userHasSpecifiedInputOutput])

  const { priceImpactWithoutFee } = computeTradePriceBreakdown(trade)
  // warnings on slippage
  const priceImpactSeverity = warningSeverity(priceImpactWithoutFee)
  const marginTrade = leverageType === LeverageType.CROSS_MARGIN
  const isValid = !swapInputError

  const showApproveFlow =
    !swapInputError &&
    (approval === ApprovalState.NOT_APPROVED ||
      approval === ApprovalState.PENDING ||
      (approvalSubmitted && approval === ApprovalState.APPROVED)) &&
    !(priceImpactSeverity > 3 && !isExpertMode)

  const handleConfirmDismiss = useCallback(() => {
    setSwapState({ showConfirm: false, tradeToConfirm, attemptingTxn, swapErrorMessage, txHash })
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onUserInput(Field.INPUT, '')
    }
  }, [attemptingTxn, onUserInput, swapErrorMessage, tradeToConfirm, txHash])

  const handleAcceptChanges = useCallback(() => {
    setSwapState({ tradeToConfirm: trade, swapErrorMessage, txHash, attemptingTxn, showConfirm })
  }, [attemptingTxn, showConfirm, swapErrorMessage, trade, txHash])

  // the callback to execute the swap
  const { callback: swapCallback, error: swapCallbackError } = useSwapCallback(
    trade,
    marginTrade,
    allowedSlippage,
    recipient,
    leverageType === LeverageType.CROSS_MARGIN && maxAmountInput ? maxAmountInput.toSignificant(6) : '0'
  )

  const handleSwap = useCallback(() => {
    if (priceImpactWithoutFee && !confirmPriceImpactWithoutFee(priceImpactWithoutFee)) {
      return
    }
    if (!swapCallback) {
      return
    }
    setSwapState({ attemptingTxn: true, tradeToConfirm, showConfirm, swapErrorMessage: undefined, txHash: undefined })
    swapCallback()
      .then(hash => {
        setSwapState({ attemptingTxn: false, tradeToConfirm, showConfirm, swapErrorMessage: undefined, txHash: hash })

        ReactGA.event({
          category: 'Swap',
          action:
            recipient === null
              ? 'Swap w/o Send'
              : (recipientAddress ?? recipient) === account
              ? 'Swap w/o Send + recipient'
              : 'Swap w/ Send',
          label: [trade?.inputAmount?.currency?.symbol, trade?.outputAmount?.currency?.symbol].join('/')
        })

        ReactGA.event({
          category: 'Routing',
          action: singleHopOnly ? 'Swap with multihop disabled' : 'Swap with multihop enabled'
        })
      })
      .catch(error => {
        setSwapState({
          attemptingTxn: false,
          tradeToConfirm,
          showConfirm,
          swapErrorMessage: error.message,
          txHash: undefined
        })
      })
  }, [
    priceImpactWithoutFee,
    swapCallback,
    tradeToConfirm,
    showConfirm,
    recipient,
    recipientAddress,
    account,
    trade,
    singleHopOnly
  ])

  return (
    <div>
      <Container>
        <ConfirmSwapModal
          isOpen={showConfirm}
          trade={trade}
          originalTrade={tradeToConfirm}
          onAcceptChanges={handleAcceptChanges}
          attemptingTxn={attemptingTxn}
          txHash={txHash}
          recipient={recipient}
          allowedSlippage={allowedSlippage}
          onConfirm={handleSwap}
          swapErrorMessage={swapErrorMessage}
          onDismiss={handleConfirmDismiss}
        />

        <ToggleWrapper style={{ backgroundColor: '#2e3233', padding: '0', borderRadius: '8px' }}>
          <ToggleOption onClick={() => handleChangeOrderType(OrderType.BUY)} active={orderType === OrderType.BUY}>
            Buy
          </ToggleOption>
          <ToggleOption onClick={() => handleChangeOrderType(OrderType.SELL)} active={orderType === OrderType.SELL}>
            Sell
          </ToggleOption>
        </ToggleWrapper>
        <ToggleWrapper>
          <FlatToggleOption
            onClick={() => onSwitchLeverageType(LeverageType.SPOT)}
            active={leverageType === LeverageType.SPOT}
          >
            Market
          </FlatToggleOption>
          <FlatToggleOption
            onClick={() => onSwitchLeverageType(LeverageType.CROSS_MARGIN)}
            active={leverageType === LeverageType.CROSS_MARGIN}
          >
            Limit
          </FlatToggleOption>
        </ToggleWrapper>

        <div>
          <CurrencyStyledInput
            label={independentField === Field.OUTPUT && !showWrap && trade ? 'From (estimated)' : 'From'}
            symbol={currencies[Field.INPUT]?.symbol}
            placeholder="Amount"
            onChange={e => {
              onUserInput(Field.INPUT, e.currentTarget.value)
            }}
            value={formattedAmounts[Field.INPUT]}
          />
          <CurrencyStyledInput
            label={independentField === Field.INPUT && !showWrap && trade ? 'To (estimated)' : 'To'}
            symbol={currencies[Field.OUTPUT]?.symbol}
            placeholder="Price"
            onChange={e => {
              onUserInput(Field.OUTPUT, e.currentTarget.value)
            }}
            value={formattedAmounts[Field.OUTPUT]}
            readOnly
          />
          <RowBetween align="center">
            <Text fontWeight={500} fontSize={14} color={theme.text2}>
              Price
            </Text>
            <TradePrice price={trade?.executionPrice} showInverted={showInverted} setShowInverted={setShowInverted} />
          </RowBetween>
        </div>
        <SettingsContainer show={leverageType === LeverageType.SPOT}>
          <span>Advanced Settings</span>
          <Settings centered />
        </SettingsContainer>
        <BottomGrouping>
          {swapIsUnsupported ? (
            <ButtonPrimary disabled={true}>Unsupported Asset</ButtonPrimary>
          ) : !account ? (
            <ButtonLight onClick={toggleWalletModal}>Connect Wallet</ButtonLight>
          ) : showWrap ? (
            <ButtonPrimary disabled={Boolean(wrapInputError)} onClick={onWrap}>
              {wrapInputError ?? (wrapType === WrapType.WRAP ? 'Wrap' : wrapType === WrapType.UNWRAP ? 'Unwrap' : null)}
            </ButtonPrimary>
          ) : noRoute && userHasSpecifiedInputOutput && tradeLoading.isLoading ? (
            <GreyCard style={{ textAlign: 'center' }}>
              <CustomLightSpinner src={Circle} alt="loader" size={'25px'} />
            </GreyCard>
          ) : noRoute && userHasSpecifiedInputOutput ? (
            <GreyCard style={{ textAlign: 'center' }}>
              Insufficient liquidity for this trade.
              {singleHopOnly && 'Try enabling multi-hop trades.'}
            </GreyCard>
          ) : leverageType !== LeverageType.CROSS_MARGIN && showApproveFlow ? (
            <RowBetween>
              <ButtonConfirmed
                onClick={approveCallback}
                disabled={approval !== ApprovalState.NOT_APPROVED || approvalSubmitted}
                altDisabledStyle={approval === ApprovalState.PENDING} // show solid button while waiting
                confirmed={approval === ApprovalState.APPROVED}
              >
                {approval === ApprovalState.PENDING ? (
                  <AutoRow gap="6px" justify="center">
                    Approving <Loader stroke="white" />
                  </AutoRow>
                ) : approvalSubmitted && approval === ApprovalState.APPROVED ? (
                  'Approved'
                ) : (
                  'Approve ' + currencies[Field.INPUT]?.symbol
                )}
              </ButtonConfirmed>
            </RowBetween>
          ) : (
            <ButtonError
              onClick={() => {
                if (isExpertMode) {
                  handleSwap()
                } else {
                  setSwapState({
                    tradeToConfirm: trade,
                    attemptingTxn: false,
                    swapErrorMessage: undefined,
                    showConfirm: true,
                    txHash: undefined
                  })
                }
              }}
              id="swap-button-2"
              disabled={!isValid || (priceImpactSeverity > 3 && !isExpertMode) || !!swapCallbackError}
              error={isValid && priceImpactSeverity > 2 && !swapCallbackError}
            >
              <Text fontSize={20} fontWeight={500}>
                {swapInputError
                  ? swapInputError
                  : priceImpactSeverity > 3 && !isExpertMode
                  ? `Price Impact Too High`
                  : `Swap${priceImpactSeverity > 2 ? ' Anyway' : ''}`}
              </Text>
            </ButtonError>
          )}
          {showApproveFlow && (
            <Column style={{ marginTop: '1rem' }}>
              <ProgressSteps steps={[approval === ApprovalState.APPROVED]} />
            </Column>
          )}
          {isExpertMode && swapErrorMessage ? <SwapCallbackError error={swapErrorMessage} /> : null}
        </BottomGrouping>
      </Container>
      {!swapIsUnsupported ? (
        <AdvancedSwapDetailsDropdown trade={trade} />
      ) : (
        <UnsupportedCurrencyFooter show={swapIsUnsupported} currencies={[currencies.INPUT, currencies.OUTPUT]} />
      )}
    </div>
  )
}

export default OrderWidget