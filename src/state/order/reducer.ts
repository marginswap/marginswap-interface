import { createReducer } from '@reduxjs/toolkit'
import { Field, selectOrderCurrency, switchOrderCurrencies, replaceOrderState, typeOrderInput } from './actions'

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
          orderIndependentField: state.orderIndependentField === Field.INPUT ? Field.OUTPUT : Field.INPUT,
          orderInput: { currencyId: currencyId },
          inAmount: ''
        }
      } else {
        return {
          ...state,
          orderIndependentField: state.orderIndependentField === Field.INPUT ? Field.OUTPUT : Field.INPUT,
          orderOutput: { currencyId: currencyId },
          outAmount: ''
        }
      }
    })
    .addCase(switchOrderCurrencies, state => {
      const inAmt = state.inAmount
      return {
        ...state,
        orderIndependentField: state.orderIndependentField === Field.INPUT ? Field.OUTPUT : Field.INPUT,
        inAmount: state.outAmount,
        outAmount: inAmt,
        orderInput: { currencyId: state.orderOutput.currencyId },
        orderOutput: { currencyId: state.orderInput.currencyId }
      }
    })
    .addCase(typeOrderInput, (state, { payload: { field, orderTypedValue } }) => {
      return {
        ...state,
        orderIndependentField: field,
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
)
