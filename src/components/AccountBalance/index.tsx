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
    // eslint-disable-next-line
  }, [url])

  console.log(tokens);

  return (
    <div className={styles.balanceWrapper}>
      <div className={styles.tokenItem}>

        <h3>Token Name</h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '50%' }}>
          <div className={styles.tooltip}>
            IR
            <span className={styles.tooltiptext}>The Annual Interest Rate is the rate of growth of your asset if you allowed the asset to be deposited on the platform for a year. Interest rates are subject to fluctuations, either modified by the platform owner or by supply-demand mechanics of users interacting with the platform.</span>
          </div>
          <div>Balance</div>
        </div>

      </div>
      {tokens.length &&
        tokens.map((token) => (
          <div className={styles.tokenItem} key={token.chainId + token.address}>
            <div style={{ display: 'flex' }}>
              <img height={24} width={24} src={token.logoURI} alt={token.symbol} />
              <div className={styles.nameDiv}>
                <h3>{token.symbol}</h3>
                <h6>{token.name}</h6>
              </div>
            </div>
            <div style={{ display: 'flex', width: '50%', justifyContent: 'space-between' }}>
              <div>0.00%</div>
              <div className={styles.balance}>0.00</div>
            </div>
          </div>
        ))}
    </div>
  )
}
AccountBalance.defaultProps = {
  url: undefined
}

export default AccountBalance
