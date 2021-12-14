import { createReducer } from '@reduxjs/toolkit'
import { OrderList } from 'types'
import {
  Field,
  selectOrderCurrency,
  switchOrderCurrencies,
  replaceOrderState,
  typeOrderInput,
  setLimitOrders,
  setOrderHistory,
  setOrderCurrencies
} from './actions'

export interface OrderState {
  readonly orderIndependentField: Field
  readonly orderTypedValue: string
  readonly inAmount: string
  readonly outAmount: string
  readonly orderInput: {
    readonly currencyId: string | undefined
  }
  readonly orderOutput: {
    readonly currencyId: string | undefined
  }
  readonly limitOrders?: OrderList
  readonly orderHistory?: OrderList
}

const initialState: OrderState = {
  orderIndependentField: Field.INPUT,
  orderTypedValue: '',
  inAmount: '',
  outAmount: '',
  orderInput: {
    currencyId: ''
  },
  orderOutput: {
    currencyId: ''
  }
}

export default createReducer<OrderState>(initialState, builder =>
  builder
    .addCase(replaceOrderState, (state, { payload: { orderTypedValue, field, inputCurrencyId, outputCurrencyId } }) => {
      return {
        ...state,
        orderInput: {
          currencyId: inputCurrencyId
        },
        orderOutput: {
          currencyId: outputCurrencyId
        },
        orderIndependentField: field,
        orderTypedValue: orderTypedValue
      }
    })
    .addCase(selectOrderCurrency, (state, { payload: { currencyId, field } }) => {
      if (field === Field.INPUT) {
        return {
          ...state,
          orderInput: { currencyId: currencyId },
          inAmount: ''
        }
      } else {
        return {
          ...state,
          orderOutput: { currencyId: currencyId },
          outAmount: ''
        }
      }
    })
    .addCase(switchOrderCurrencies, state => {
      const inAmt = state.inAmount
      return {
        ...state,
        inAmount: state.outAmount,
        outAmount: inAmt,
        orderInput: { currencyId: state.orderOutput.currencyId },
        orderOutput: { currencyId: state.orderInput.currencyId }
      }
    })
    .addCase(typeOrderInput, (state, { payload: { field, orderTypedValue } }) => {
      return {
        ...state,
        inAmount: field === Field.INPUT ? orderTypedValue : state.inAmount,
        outAmount: field === Field.OUTPUT ? orderTypedValue : state.outAmount,
        orderInput: {
          currencyId: state.orderInput.currencyId
        },
        orderOutput: {
          currencyId: state.orderOutput.currencyId
        },
        orderTypedValue
      }
    })
    .addCase(setLimitOrders, (state, { payload: { orders } }) => {
      return {
        ...state,
        limitOrders: orders
      }
    })
    .addCase(setOrderHistory, (state, { payload: { orders } }) => {
      return {
        ...state,
        orderHistory: orders
      }
    })
    .addCase(setOrderCurrencies, (state, { payload: { inputCurrency, outputCurrency } }) => {
      const inAmt = state.inAmount
      return {
        ...state,
        inAmount: state.outAmount,
        outAmount: inAmt,
        orderInput: { currencyId: inputCurrency },
        orderOutput: { currencyId: outputCurrency }
      }
    })
)
