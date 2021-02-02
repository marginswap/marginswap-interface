import React, { FC, useEffect, useState } from 'react'
import { useFetchListCallback } from 'hooks/useFetchListCallback'
import styles from './styles.module.css'
import { TokenInfo } from '@uniswap/token-lists'

interface Props {
  url?: string | undefined
}

const AccountBalance: FC<Props> = ({ url }: Props) => {
  const [tokens, setTokens] = useState<TokenInfo[]>([])
  const fetchList = useFetchListCallback()

  useEffect(() => {
    if (url) {
      fetchList(url, false)
        .then(({ tokens }) => setTokens(tokens))
        .catch(error => console.debug('interval list fetching error', error))
    }
  }, [url])

  return (
    <div className={styles.balanceWrapper}>
      {tokens.length &&
        tokens.map((token, index) => (
          <div className={styles.tokenItem} key={token.chainId + token.address}>
            <img height={24} width={24} src={token.logoURI} alt={token.symbol} />
            <div className={styles.nameDiv}>
              <h3>{token.symbol}</h3>
              <h6>{token.name}</h6>
            </div>
            <div className={styles.balance}>0.00</div>
          </div>
        ))}
    </div>
  )
}
AccountBalance.defaultProps = {
  url: undefined
}

export default AccountBalance
