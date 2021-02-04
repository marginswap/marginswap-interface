import React, { useEffect, useState } from 'react'
import { useAllLists } from 'state/lists/hooks'
import { TokenInfo } from '@uniswap/token-lists'
import { useFetchListCallback } from 'hooks/useFetchListCallback'
import EnhancedTable from 'components/AccountBalance'

const Develop = () => {

  const lists = useAllLists()
  const [tokens, setTokens] = useState<TokenInfo[]>([])
  const fetchList = useFetchListCallback()

  console.log(tokens)
  useEffect(() => {
    const url = Object.keys(lists)[0]
    if (url) {
      fetchList(url, false)
        .then(({ tokens }) => setTokens(tokens))
        .catch(error => console.debug('interval list fetching error', error))
    }
    // eslint-disable-next-line
  }, [])

  return (
    <div style={{ width: '80%', margin: 'auto', padding: 40 }}>
      <EnhancedTable tokens={tokens || []} />
    </div>
  )
}

export default Develop
