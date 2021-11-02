import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useWeb3React } from '@web3-react/core'

import {
  getAccountBalances,
  getAccountBorrowTotal,
  getAccountHoldingTotal,
  TokenAmount,
  getTokenAllowances,
  getTokenBalance,
  Token,
  borrowableInPeg,
  withdrawableInPeg
} from '@marginswap/sdk'

import { TokenInfo } from '@uniswap/token-lists'
import { useActiveWeb3React } from '../../hooks'
import { BigNumber } from '@ethersproject/bignumber'
import { getDefaultProvider } from '@ethersproject/providers'
import { utils } from 'ethers'
import { getPegCurrency, USDT_MAINNET } from '../../constants'
import { valueInPeg2token } from 'state/wallet/hooks'
import { NETWORK_URLS } from '../../constants/networks'
import tokensList from '../../constants/tokenLists/marginswap-default.tokenlist.json'

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
import Logo from './Logo'

const AccountBalance = () => {
  const { chainId } = useActiveWeb3React()
  const { account } = useWeb3React()

  const [tokens, setTokens] = useState<TokenInfo[]>([])
  const [holdingAmounts, setHoldingAmounts] = useState<Record<string, number>>({})
  const [, setBorrowingAmounts] = useState<Record<string, number>>({})
  const [, setHoldingTotal] = useState<TokenAmount>(new TokenAmount(getPegCurrency(chainId) ?? USDT_MAINNET, '0'))
  const [, setDebtTotal] = useState(new TokenAmount(getPegCurrency(chainId) ?? USDT_MAINNET, '0'))
  const [, setAllowances] = useState<Record<string, number>>({})
  const [borrowableAmounts, setBorrowableAmounts] = useState<Record<string, TokenAmount>>({})
  const [, setWithdrawableAmounts] = useState<Record<string, TokenAmount>>({})
  const [, setTokenBalances] = useState<Record<string, number>>({})

  const queryProvider = getDefaultProvider(chainId && NETWORK_URLS[chainId])

  useEffect(() => {
    const tokensToSet = tokensList.tokens.filter(t => t.chainId === chainId)
    setTokens(tokensToSet)
  }, [tokensList, chainId])

  /**
   *
   *
   * Get User MarginSwap Data
   * @description fetches the data that does not need to be polled because the app knows when it changes
   *
   */
  const getUserMarginswapData = async () => {
    if (!chainId || !account || !tokens?.length) return

    // a big Promise.all to fetch all the data
    const [
      _balances,
      _allowances,
      _borrowableAmounts,
      _withdrawableAmounts,
      _tokenBalances,
      _holdingTotal,
      _debtTotal
    ] = await Promise.all([
      // margin account balances (array)
      getAccountBalances(account, chainId, queryProvider),
      // which tokens have approved the marginswap contract
      getTokenAllowances(
        account,
        tokens.map(token => token.address),
        chainId,
        queryProvider
      ),
      // borrowable amounts (max borrowable by token)
      Promise.all(
        tokens.map(async token => {
          const tokenToken = new Token(chainId, token.address, token.decimals)
          const bipString = await borrowableInPeg(account, chainId, queryProvider)
          const bip = new TokenAmount(getPegCurrency(chainId) ?? USDT_MAINNET, bipString)

          if (bip) {
            return new TokenAmount(
              tokenToken,
              ((await valueInPeg2token(bip, tokenToken, chainId, queryProvider)) ?? utils.parseUnits('0')).toString()
            )
          } else {
            return new TokenAmount(tokenToken, '0')
          }
        })
      ),
      // withdrawable amounts (max withdrawable by token)
      Promise.all(
        tokens.map(async token => {
          const tokenToken = new Token(chainId, token.address, token.decimals)
          const wipString = await withdrawableInPeg(account, chainId, queryProvider)
          const wip = new TokenAmount(getPegCurrency(chainId) ?? USDT_MAINNET, wipString)

          if (wip) {
            const tokenAmount = (
              (await valueInPeg2token(wip, tokenToken, chainId, queryProvider)) ?? utils.parseUnits('0')
            ).toString()

            return new TokenAmount(tokenToken, tokenAmount)
          } else {
            return new TokenAmount(tokenToken, '0')
          }
        })
      ),
      // wallet token balances
      Promise.all(tokens.map(token => getTokenBalance(account, token.address, queryProvider))),
      // holding total (sum of all account balances)
      new TokenAmount(
        getPegCurrency(chainId) ?? USDT_MAINNET,
        (await getAccountHoldingTotal(account, chainId, queryProvider)).toString()
      ),
      // debt total (sum of all debt balances)
      new TokenAmount(
        getPegCurrency(chainId) ?? USDT_MAINNET,
        (await getAccountBorrowTotal(account, chainId, queryProvider)).toString()
      )
    ])

    /*** now set the state for all that data ***/

    // margin account equity balances
    setHoldingAmounts(
      Object.keys(_balances.holdingAmounts).reduce(
        (acc, cur) => ({
          ...acc,
          [cur]: BigNumber.from(_balances.holdingAmounts[cur]).toString()
        }),
        {}
      )
    )
    // margin account debt balances
    setBorrowingAmounts(
      Object.keys(_balances.borrowingAmounts).reduce(
        (acc, cur) => ({
          ...acc,
          [cur]: BigNumber.from(_balances.borrowingAmounts[cur]).toString()
        }),
        {}
      )
    )
    // which tokens have approved the marginswap contract
    setAllowances(
      _allowances.reduce(
        (acc: any, cur: number, index: number) => ({
          ...acc,
          [tokens[index].address]: cur
        }),
        {}
      )
    )
    // borrowable amounts (max borrowable by token)
    setBorrowableAmounts(_borrowableAmounts.reduce((acc, cur, index) => ({ ...acc, [tokens[index].address]: cur }), {}))
    // withdrawable amounts (max borrowable by token)
    setWithdrawableAmounts(
      _withdrawableAmounts.reduce((acc, cur, index) => ({ ...acc, [tokens[index].address]: cur }), {})
    )
    // wallet token balances
    setTokenBalances(
      _tokenBalances.reduce(
        (acc, cur, index) => ({
          ...acc,
          [tokens[index].address]: Number(utils.formatUnits(_tokenBalances[index], tokens[index].decimals))
        }),
        {}
      )
    )
    // holding total (sum of all account balances)
    setHoldingTotal(_holdingTotal)

    // debt total (sum of all debt balances)
    setDebtTotal(_debtTotal)
  }

  useEffect(() => {
    getUserMarginswapData()
  }, [account, tokens, chainId])

  const getMaxBorrowable = () => {
    const result = tokens.map(token => {
      const tokenBalance = Number(holdingAmounts[token.address] ?? 0) / Math.pow(10, token.decimals)

      if (tokenBalance > 0) {
        const tokenMaxBorrow = borrowableAmounts[token.address]
          ? parseFloat(borrowableAmounts[token.address].toFixed(6))
          : 0
        return tokenMaxBorrow
      }
      return 0
    })

    if (!result.length) return 0

    const maxBorrowable = result.reduce((total, amount) => total + amount)
    return maxBorrowable ? utils.commify(maxBorrowable.toFixed(6)) : 0
  }

  const getMarginTotalBalance = () => {
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i]
      const tokenBalance = Number(holdingAmounts[token.address] ?? 0) / Math.pow(10, token.decimals)

      if (tokenBalance > 0) {
        return true
      }
    }

    return false
  }

  return (
    <Container>
      <WidgetHeader>Account Balance</WidgetHeader>
      <Content>
        {getMarginTotalBalance() ? (
          <>
            {tokens.map(token => {
              const tokenBalance = Number(holdingAmounts[token.address] ?? 0) / Math.pow(10, token.decimals)

              if (tokenBalance > 0) {
                return (
                  <Row key={token.symbol}>
                    <Item>
                      <Logo address={token.address} /> {token.symbol}
                    </Item>
                    <Item style={{ textAlign: 'right' }}>{utils.commify(tokenBalance.toFixed(6))}</Item>
                  </Row>
                )
              }

              return null
            })}
            <Row>
              <Item>Max Borrowable</Item>
              <Item style={{ textAlign: 'right' }}>{getMaxBorrowable()}</Item>
            </Row>
          </>
        ) : (
          <span style={{ marginLeft: '0.8rem', paddingTop: '1rem', paddingBottom: '1rem' }}>
            Make a deposit in your margin account to start trading with margin
          </span>
        )}
      </Content>
      <Actions>
        <Link to="/margin-account" key="withdraw">
          <PrimaryButton>Withdraw</PrimaryButton>
        </Link>
        <Link to="/margin-account" key="deposit">
          <SecondaryButton>Deposit</SecondaryButton>
        </Link>
      </Actions>
    </Container>
  )
}

export default AccountBalance
