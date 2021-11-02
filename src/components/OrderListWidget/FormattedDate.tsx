import React from 'react'
import { DateTime } from 'luxon'
import { OrderInfo } from 'types'

const FormattedDate = ({ order }: { order: OrderInfo }) => {
  return <span>{DateTime.fromMillis(+order.createdAt * 1000).toLocaleString(DateTime.DATE_SHORT)}</span>
}

export default FormattedDate
