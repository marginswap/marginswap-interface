import { createAction } from '@reduxjs/toolkit'
import { OrderList } from 'types'

export enum Field {
  INPUT = 'INPUT',
  OUTPUT = 'OUTPUT'
}

export const selectOrderCurrency = createAction<{ field: Field; currencyId: string }>('order/selectOrderCurrency')
export const switchOrderCurrencies = createAction<void>('order/switchOrderCurrencies')
export const typeOrderInput = createAction<{ field: Field; orderTypedValue: string }>('order/typeOrderInput')
export const setLimitOrders = createAction<{ orders: OrderList }>('order/limitOrders')
export const setOrderHistory = createAction<{ orders: OrderList }>('order/orderHistory')
export const setOrderCurrencies =
  createAction<{ inputCurrency: string; outputCurrency: string }>('order/setOrderCurrencies')
export const replaceOrderState = createAction<{
  field: Field
  orderTypedValue: string
  inputCurrencyId?: string
  outputCurrencyId?: string
}>('order/replaceOrderState')
