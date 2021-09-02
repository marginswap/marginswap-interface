import { Button } from '@material-ui/core'
import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  background-color: #2b2b2c;
  border-radius: 7px;
  display: flex;
  flex-direction: column;
  height: 260px;
  margin-top: 10px;
`

const StyledDefaultButton = styled(Button)`
  > span {
    color: white;
  }
`

const ActionsHeader = styled.div`
  background-color: #161618;
  border-top-left-radius: 7px;
  border-top-right-radius: 7px;
  height: 40px;
  width: 100%;

  > button {
    height: 30px;
    margin-top: 5px;
    margin-left: 7px;
    text-transform: capitalize;
  }
`

const GridContainer = styled.div`
  padding: 10px;
`

const Header = styled.div`
  display: flex;
  flex-direction: row;
  padding: 8px;
  width: 100%;
  margin-bottom: 4px;
  border-bottom: 1px solid #525252;

  > div {
    font-size: 12px;
    width: 20%;
  }
`

const Item = styled.div`
  color: white;
  width: 100%;
  font-size: 12px;
`

const Row = styled.div`
  display: flex;
  flex-direction: row;
  padding: 6px;
  width: 100%;

  > div {
    display: flex;
    flex-direction: column;
    font-size: 13px;
    width: 20%;
  }
`

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
