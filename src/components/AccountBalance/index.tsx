import { ButtonPrimary, ButtonSecondary, ButtonLight } from 'components/Button'
import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  padding: 5px 10px;
  color: #fff;
`

const AccountBalance = () => {
  return (
    <Container>
      <h5>Account Balance</h5>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        {/* <ButtonPrimary>Withdraw</ButtonPrimary>
        <ButtonLight>Withdraw</ButtonLight> */}
      </div>
    </Container>
  )
}

export default AccountBalance
