import React from 'react'
import { GreyCard } from '../../components/Card'
import { TYPE } from '../../theme'

const UserActionNofication = () => {
  return (
    <GreyCard style={{ textAlign: 'center' }}>
      <TYPE.main mb="4px">Not Approved Transaction</TYPE.main>
    </GreyCard>
  )
}

export default UserActionNofication
