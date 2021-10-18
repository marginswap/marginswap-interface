import { createAction } from '@reduxjs/toolkit'

export enum Field {
  INPUT = 'INPUT',
  OUTPUT = 'OUTPUT'
}

export const selectOrderCurrency = createAction<{ field: Field; currencyId: string }>('order/selectOrderCurrency')
export const switchOrderCurrencies = createAction<void>('order/switchOrderCurrencies')
export const typeOrderInput = createAction<{ field: Field; orderTypedValue: string }>('order/typeOrderInput')
export const replaceOrderState = createAction<{
  field: Field
  orderTypedValue: string
  inputCurrencyId?: string
  outputCurrencyId?: string
}>('order/replaceOrderState')
