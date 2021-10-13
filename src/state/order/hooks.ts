import { useCallback } from 'react'
import { AppDispatch, AppState } from '../index'
import { useDispatch, useSelector } from 'react-redux'
import { ChainId, makeOrder } from '@marginswap/sdk'
import { Currency, CurrencyAmount, ETHER, Token } from '@marginswap/sdk'
import { useActiveWeb3React } from '../../hooks'
import { useCurrency } from '../../hooks/Tokens'
import { useBorrowable, useCurrencyBalances } from '../wallet/hooks'
import { tryParseAmount } from 'state/swap/hooks'
import { Field, selectOrderCurrency, switchOrderCurrencies, typeOrderInput } from './actions'

export function useOrderState(): AppState['order'] {
  return useSelector<AppState, AppState['order']>(state => state.order)
}

export function useDerivedOrderInfo(): {
  orderCurrencies: { [field in Field]: Currency }
  orderCurrencyBalances: { [field in Field]?: CurrencyAmount }
  orderParsedAmount: CurrencyAmount | undefined
  orderInputError?: string
} {
  const { account } = useActiveWeb3React()

  const {
    orderIndependentField,
    orderTypedValue,
    inAmount,
    outAmount,
    orderInput: { currencyId: inputCurrencyId },
    orderOutput: { currencyId: outputCurrencyId }
  } = useOrderState()

  const inputCurrency = useCurrency(inputCurrencyId)
  const outputCurrency = useCurrency(outputCurrencyId)
  const tokenBalance = useCurrencyBalances(account ?? undefined, [inputCurrency ?? undefined])
  const typedAmounts = {
    [Field.INPUT]: tryParseAmount(inAmount, inputCurrency ?? undefined),
    [Field.OUTPUT]: tryParseAmount(outAmount, outputCurrency ?? undefined)
  }

  const isExactIn: boolean = orderIndependentField === Field.INPUT
  const orderParsedAmount = tryParseAmount(orderTypedValue, (isExactIn ? inputCurrency : outputCurrency) ?? undefined)
  const borrowBalance = useBorrowable(inputCurrency ?? undefined)
  const relevantInput =
    !!tokenBalance[0] && !!borrowBalance && borrowBalance.currency.symbol === tokenBalance[0].currency.symbol
      ? tokenBalance[0]?.add(borrowBalance)
      : tokenBalance[0]
  const orderCurrencyBalances = {
    [Field.INPUT]: relevantInput
  }
  const orderCurrencies: { [field in Field]: Currency } = {
    [Field.INPUT]: inputCurrency || ETHER,
    [Field.OUTPUT]: outputCurrency || ETHER
  }

  let orderInputError: string | undefined
  if (!account) {
    orderInputError = 'Connect Wallet'
  }

  if (!orderParsedAmount || !(typedAmounts[Field.INPUT] && typedAmounts[Field.OUTPUT])) {
    orderInputError = orderInputError ?? 'Enter an amount'
  }

  if (!orderCurrencies[Field.INPUT] || !orderCurrencies[Field.OUTPUT]) {
    orderInputError = orderInputError ?? 'Select a token'
  }

  // compare input balance to max input based on version
  const [balanceIn, amountIn] = [orderCurrencyBalances[Field.INPUT], typedAmounts[Field.INPUT]]

  if (balanceIn && amountIn && balanceIn.lessThan(amountIn)) {
    orderInputError = 'Insufficient ' + balanceIn.currency.symbol + ' balance'
  }

  return {
    orderCurrencies,
    orderCurrencyBalances,
    orderParsedAmount,
    orderInputError
  }
}

export function useOrderActionHandlers(): {
  onOrderCurrencySelection: (field: Field, currency: Currency) => void
  onOrderSwitchTokens: () => void
  onOrderUserInput: (field: Field, typedValue: string) => void
} {
  const dispatch = useDispatch<AppDispatch>()
  const onOrderCurrencySelection = useCallback(
    (field: Field, currency: Currency) => {
      dispatch(
        selectOrderCurrency({
          field,
          currencyId: currency instanceof Token ? currency.address : currency === ETHER ? 'ETH' : ''
        })
      )
    },
    [dispatch]
  )

  const onOrderSwitchTokens = useCallback(() => {
    dispatch(switchOrderCurrencies())
  }, [dispatch])

  const onOrderUserInput = useCallback(
    (field: Field, orderTypedValue: string) => {
      dispatch(typeOrderInput({ field, orderTypedValue }))
    },
    [dispatch]
  )

  return {
    onOrderSwitchTokens,
    onOrderCurrencySelection,
    onOrderUserInput
  }
}

export function useMakeOrder(): {
  onMakeOrder: (
    chainId: ChainId,
    provider: any,
    fromToken: string | undefined,
    toToken: string | undefined,
    inAmount: string,
    outAmount: string
  ) => Promise<string>
} {
  const onMakeOrder = async (
    chainId: ChainId,
    provider: any,
    fromToken: string | undefined,
    toToken: string | undefined,
    inAmount: string,
    outAmount: string
  ): Promise<string> => {
    try {
      if (!chainId || !provider || !fromToken || !toToken || !inAmount || !outAmount) {
        throw new Error('Missing dependencies')
      }

      const result = await makeOrder(fromToken, toToken, inAmount, outAmount, chainId, provider)
      return result.blockHash
    } catch (error: any) {
      if (error?.code === 4001) {
        throw new Error(`Transaction rejected: ${error.message}`)
      } else {
        throw new Error(`Order failed: ${error.message}`)
      }
    }
  }

  return {
    onMakeOrder
  }
}
