import React from 'react'
import AccountBalance from 'components/AccountBalance'
import { useAllLists } from 'state/lists/hooks'

const Develop = () => {
  const lists = useAllLists()

  return (
    <div style={{ width: '100%' }}>
      <AccountBalance url={Object.keys(lists)[0]} />
    </div>
  )
}

export default Develop
