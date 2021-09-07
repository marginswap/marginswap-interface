import { Button } from '@material-ui/core'
import React from 'react'

import {
  Container,
  ActionsHeader,
  Header,
  Row,
  Item,
  StyledDefaultButton,
  GridContainer
} from './OrderListWidget.styles'

const orders = [
  {
    id: 0,
    date: '09/01/2021',
    pair: 'ETH - DAI',
    type: 'Buy',
    amount: '$10.00',
    total: '$10.00'
  },
  {
    id: 1,
    date: '09/01/2021',
    pair: 'ETH - DAI',
    type: 'Buy',
    amount: '$10.00',
    total: '$10.00'
  },
  {
    id: 2,
    date: '09/01/2021',
    pair: 'ETH - DAI',
    type: 'Buy',
    amount: '$10.00',
    total: '$10.00'
  },
  {
    id: 3,
    date: '09/01/2021',
    pair: 'ETH - DAI',
    type: 'Buy',
    amount: '$10.00',
    total: '$10.00'
  },
  {
    id: 4,
    date: '09/01/2021',
    pair: 'ETH - DAI',
    type: 'Buy',
    amount: '$10.00',
    total: '$10.00'
  },
  {
    id: 5,
    date: '09/01/2021',
    pair: 'ETH - DAI',
    type: 'Buy',
    amount: '$10.00',
    total: '$10.00'
  },
  {
    id: 6,
    date: '09/01/2021',
    pair: 'ETH - DAI',
    type: 'Buy',
    amount: '$10.00',
    total: '$10.00'
  },
  {
    id: 7,
    date: '09/01/2021',
    pair: 'ETH - DAI',
    type: 'Buy',
    amount: '$10.00',
    total: '$10.00'
  },
  {
    id: 8,
    date: '09/01/2021',
    pair: 'ETH - DAI',
    type: 'Buy',
    amount: '$10.00',
    total: '$10.00'
  },
  {
    id: 9,
    date: '09/01/2021',
    pair: 'ETH - DAI',
    type: 'Buy',
    amount: '$10.00',
    total: '$10.00'
  }
]

const OrdersWidget = () => {
  return (
    <Container>
      <ActionsHeader>
        <StyledDefaultButton>Limit Orders</StyledDefaultButton>
        <Button color="primary" variant="contained">
          Order History
        </Button>
      </ActionsHeader>
      <GridContainer>
        <Header>
          <Item>Date</Item>
          <Item>Pair</Item>
          <Item>Type</Item>
          <Item>Amount</Item>
          <Item>Total</Item>
        </Header>
        {orders.map(order => (
          <Row key={order.id}>
            <Item>{order.date}</Item>
            <Item>{order.pair}</Item>
            <Item>{order.type}</Item>
            <Item>{order.amount}</Item>
            <Item>{order.total}</Item>
          </Row>
        ))}
      </GridContainer>
    </Container>
  )
}

export default OrdersWidget
