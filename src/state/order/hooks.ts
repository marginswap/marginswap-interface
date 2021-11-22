import { useCallback } from 'react'
import { AppDispatch, AppState } from '../index'
import { useDispatch, useSelector } from 'react-redux'
import { makeOrder, invalidateOrder, getOrdersPerUser, OrderRecord } from '@marginswap/sdk'
import { Currency, CurrencyAmount, ETHER, Token } from '@marginswap/sdk'
import { useActiveWeb3React } from '../../hooks'
import { useCurrency } from '../../hooks/Tokens'
import { useBorrowable, useCurrencyBalances } from '../wallet/hooks'
import { tryParseAmount } from 'state/swap/hooks'
import { parseUnits } from '@ethersproject/units'
import { Field, selectOrderCurrency, switchOrderCurrencies, typeOrderInput } from './actions'
import { useTransactionAdder } from 'state/transactions/hooks'

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

export function useLimitOrders(provider: any): {
  onMakeOrder: null | (() => Promise<string>)
  onInvalidateOrder: null | ((orderId: string) => Promise<string>)
  onGetLimitOrders: null | ((address: string) => Promise<Record<number, OrderRecord>>)
} {
  const { chainId } = useActiveWeb3React()
  const { inAmount, outAmount, orderInput, orderOutput } = useOrderState()
  const { orderCurrencies } = useDerivedOrderInfo()
  const addTransaction = useTransactionAdder()

  return {
    onMakeOrder: async function onOrder(): Promise<string> {
      const inAmt = parseUnits(inAmount, orderCurrencies[Field.INPUT]?.decimals).toString()
      const outAmt = parseUnits(outAmount, orderCurrencies[Field.OUTPUT]?.decimals).toString()

      try {
        if (!chainId || !provider || !orderInput.currencyId || !orderOutput.currencyId || !inAmt || !outAmt) {
          throw new Error('Missing dependencies')
        }

        const response = await makeOrder(
          orderInput.currencyId,
          orderOutput.currencyId,
          inAmt,
          outAmt,
          chainId,
          provider
        )
        const result = response as any
        addTransaction(result, {
          summary: `Order of ${inAmount} ${orderCurrencies[Field.INPUT].symbol} for ${outAmount} ${
            orderCurrencies[Field.OUTPUT].symbol
          }`
        })

        // order of 0.00001 WETH for 10000 USDT
        return result.hash
      } catch (error: any) {
        if (error?.code === 4001) {
          throw new Error(`Transaction rejected: ${error.message}`)
        } else {
          throw new Error(`Order failed: ${error.message}`)
        }
      }
    },
    onInvalidateOrder: async function onInvalidate(orderId: string): Promise<string> {
      try {
        if (!chainId || !provider) {
          throw new Error('Missing dependencies')
        }

        const response = await invalidateOrder(orderId, chainId, provider)
        const result = response as any
        addTransaction(result, {
          summary: `Limit Order Cancellation`
        })

        return result.hash
      } catch (error: any) {
        if (error?.code === 4001) {
          throw new Error(`Transaction rejected: ${error.message}`)
        } else {
          throw new Error(`Order failed: ${error.message}`)
        }
      }
    },
    onGetLimitOrders: async function onGetOrdersPerUser(address: string): Promise<Record<number, OrderRecord>> {
      if (!chainId || !provider) {
        throw new Error('Missing dependencies')
      }

      const orders = await getOrdersPerUser(address, chainId, provider)

      return orders
    }
  }
}
