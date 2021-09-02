import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  padding: 5px 10px;
  color: #fff;
`

const Content = styled.div`
  display: flex;
  flex-wrap: wrap;
`

const Row = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;

  > div {
    flex: 50%;
    margin-bottom: 10px;
  }

  > div:last-child {
    text-align: right;
  }
`

const Item = styled.div`
  font-size: 14px;
  width: 100%;
`

const Actions = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 15px;
  margin-bottom: 15px;
`

const PrimaryButton = styled.button`
  background: rgb(46, 32, 185);
  background: linear-gradient(90deg, rgba(46, 32, 185, 1) 0%, rgba(128, 11, 188, 1) 100%);
  border-radius: 25px;
  color: white;
  min-width: 125px;
  border: none;
  height: 40px;

  :hover {
    background: linear-gradient(90deg, rgba(59, 45, 196, 1) 0%, rgba(144, 26, 205, 1) 100%);
  }
`

const SecondaryButton = styled.button`
  background-color: #2e3233;
  border-radius: 25px;
  color: white;
  min-width: 125px;
  border: none;
  height: 40px;

  :hover {
    background-color: #37393a;
  }
`

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
      <h5>Account Balance</h5>
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
