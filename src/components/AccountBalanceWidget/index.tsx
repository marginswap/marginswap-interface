import React from 'react'
import {
  Container,
  Content,
  Row,
  Item,
  Actions,
  PrimaryButton,
  SecondaryButton,
  WidgetHeader
} from './AccountBalanceWidget.styles'

const balanceItems = [
  {
    id: 1,
    name: 'ETH',
    value: '0.000000'
  },
  {
    id: 2,
    name: 'USDC',
    value: '0.0000'
  },
  {
    id: 3,
    name: 'DAI',
    value: '0.0000'
  },
  {
    id: 4,
    name: 'Max Borrowable',
    value: '0.0000'
  }
]

const AccountBalance = () => {
  return (
    <Container>
      <WidgetHeader>Account Balance</WidgetHeader>
      <Content>
        {balanceItems.map(e => (
          <Row key={e.id}>
            <Item>{e.name}</Item>
            <Item style={{ textAlign: 'right' }}>{e.value}</Item>
          </Row>
        ))}
      </Content>
      <Actions>
        <PrimaryButton>Withdraw</PrimaryButton>
        <SecondaryButton>Deposit</SecondaryButton>
      </Actions>
    </Container>
  )
}

export default AccountBalance
