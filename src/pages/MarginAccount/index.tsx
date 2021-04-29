import React, { useEffect, useMemo, useState } from 'react'
import useParsedQueryString from 'hooks/useParsedQueryString'
import TokensTable from '../../components/TokensTable'
import InfoCard from '../../components/InfoCard'
import IconBanknotes from '../../icons/IconBanknotes'
import IconScales from '../../icons/IconScales'
import IconCoin from '../../icons/IconCoin'
import RiskMeter from '../../components/Riskmeter'
import { useWeb3React } from '@web3-react/core'
import {
  getAccountBalances,
  getAccountBorrowTotal,
  getAccountHoldingTotal,
  crossDeposit,
  crossWithdraw,
  approveToFund,
  TokenAmount,
  getTokenAllowances,
  //  crossBorrow,
  getTokenBalance,
  Token,
  crossDepositETH,
  crossWithdrawETH,
  borrowableInPeg,
  withdrawableInPeg,
  totalLendingAvailable,
  getBorrowInterestRates
} from '@marginswap/sdk'
import { TokenInfo } from '@uniswap/token-lists'
import { ErrorBar, WarningBar } from '../../components/Placeholders'
import { useActiveWeb3React } from '../../hooks'
import { getProviderOrSigner } from '../../utils'
import { BigNumber } from '@ethersproject/bignumber'
import { StyledTableContainer } from './styled'
import { StyledMobileOnlyRow } from './styled'
import { StyledWrapperDiv } from './styled'
import { StyledSectionDiv } from './styled'
import { utils, constants } from 'ethers'
import { toast } from 'react-toastify'
import { useIsTransactionPending, useTransactionAdder } from '../../state/transactions/hooks'
import { getPegCurrency } from '../../constants'
import { setInterval } from 'timers'
import { valueInPeg2token, useETHBalances } from 'state/wallet/hooks'
import tokensList from '../../constants/tokenLists/marginswap-default.tokenlist.json'
import { TransactionDetails } from '../../state/transactions/reducer'

type AccountBalanceData = {
  img: string
  coin: string
  decimals: number
  address: string
  balance: number
  borrowed: number
  borrowable: number
  withdrawable: number
  liquidity: number
  maxBorrow: number
  maxWithdraw: number
  available: number
  ir: number
}

const ACCOUNT_COLUMNS = [
  {
    name: 'Coin',
    id: 'coin',
    // eslint-disable-next-line react/display-name
    render: (token: AccountBalanceData) => (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img src={token.img} alt={token.coin} height={30} />
        <span style={{ marginLeft: '5px' }}>{token.coin}</span>
      </div>
    )
  },
  { name: 'Total Balance', id: 'balance' },
  { name: 'Debt', id: 'borrowed' },
  { name: 'APR', id: 'ir' },
  { name: 'Borrowable', id: 'borrowable' },
  { name: 'Liquidity', id: 'liquidity' }
] as const

const LIQUIDATION_RATIO = 1.15
const SAFE_RATIO = 2.5

const getRisk = (holding: number, debt: number): number => {
  if (debt === 0) return 0
  const marginLevel = Math.max(Math.min(holding / debt, SAFE_RATIO), LIQUIDATION_RATIO)
  return 10 - 10 * ((marginLevel - LIQUIDATION_RATIO) / (SAFE_RATIO - LIQUIDATION_RATIO))
}

const DATA_POLLING_INTERVAL = 60 * 1000

export const MarginAccount = () => {
  const { library, chainId } = useActiveWeb3React()
  const { eth } = useParsedQueryString()
  const [error, setError] = useState<string | null>(null)

  const [tokens, setTokens] = useState<TokenInfo[]>([])
  const [holdingAmounts, setHoldingAmounts] = useState<Record<string, number>>({})
  const [borrowingAmounts, setBorrowingAmounts] = useState<Record<string, number>>({})
  const [holdingTotal, setHoldingTotal] = useState<TokenAmount>(new TokenAmount(getPegCurrency(chainId), '0'))
  const [debtTotal, setDebtTotal] = useState(new TokenAmount(getPegCurrency(chainId), '0'))
  const [borrowAPRs, setBorrowAPRs] = useState<Record<string, number>>({})
  const [allowances, setAllowances] = useState<Record<string, number>>({})
  const [borrowableAmounts, setBorrowableAmounts] = useState<Record<string, TokenAmount>>({})
  const [withdrawableAmounts, setWithdrawableAmounts] = useState<Record<string, TokenAmount>>({})
  const [liquidities, setLiquidities] = useState<Record<string, TokenAmount>>({})
  const [tokenBalances, setTokenBalances] = useState<Record<string, number>>({})
  const [pollingInterval, setPollingInterval] = useState<ReturnType<typeof setInterval> | null>()
  const [triggerDataPoll, setTriggerDataPoll] = useState<boolean>(true)
  const [tokenApprovalStates, setTokenApprovalStates] = useState<Record<string, boolean>>({})
  const [pendingTxhHash, setPendingTxhHash] = useState<string | null>()

  const { account } = useWeb3React()
  const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? '']
  const isTxnPending = useIsTransactionPending(pendingTxhHash || '')

  const addTransactionResponseCallback = (responseObject: TransactionDetails) => {
    if (responseObject.summary !== 'Approve') {
      setPendingTxhHash(responseObject.hash)
    }
  }

  const delayedFetchUserData = () => {
    setTimeout(() => {
      getUserMarginswapData()
    }, 2 * 1000)
  }

  useEffect(() => {
    if (!isTxnPending && pendingTxhHash) {
      setPendingTxhHash(null)

      delayedFetchUserData()
    }
  }, [isTxnPending])

  const addTransaction = useTransactionAdder(addTransactionResponseCallback)

  let provider: any
  if (library && account) {
    provider = getProviderOrSigner(library, account)
  }

  const ACCOUNT_ACTIONS = [
    // {
    //   name: 'Borrow',
    //   onClick: async (token: AccountBalanceData, amount: number) => {
    //     if (!amount || !chainId) return
    //     try {
    //       const res: any = await crossBorrow(
    //         token.address,
    //         utils.parseUnits(String(amount), token.decimals).toHexString(),
    //         chainId,
    //         provider
    //       )
    //       addTransaction(res, {
    //         summary: `Borrow`
    //       })
    //       setTriggerDataPoll(true)
    //       getUserMarginswapData()
    //     } catch (e) {
    //       toast.error('Borrow error', { position: 'bottom-right' })
    //       console.error(error)
    //     }
    //   },
    //   deriveMaxFrom: 'maxBorrow'
    // },
    //
    // {
    //   name: 'Repay',
    //   onClick: (token: AccountBalanceData, amount: number) => {
    //     console.log('repay', token)
    //     console.log('amount :>> ', amount)
    //   }
    // },
    {
      name: 'Deposit',
      onClick: async (tokenInfo: AccountBalanceData, amount: number) => {
        if (!amount || tokenApprovalStates[tokenInfo.address] || !chainId) return
        if (allowances[tokenInfo.address] < amount) {
          try {
            const approveRes: any = await approveToFund(
              tokenInfo.address,
              constants.MaxUint256.toHexString(),
              chainId,
              provider
            )
            localStorage.setItem(`${tokenInfo.coin}_LAST_DEPOSIT`, new Date().toISOString())
            addTransaction(approveRes, {
              summary: `Approve`
            })
            setTriggerDataPoll(true)
            delayedFetchUserData()

            setTokenApprovalStates({ ...tokenApprovalStates, [tokenInfo.address]: true })
            setTimeout(() => {
              setTokenApprovalStates({ ...tokenApprovalStates, [tokenInfo.address]: false })
            }, 20 * 1000)
          } catch (e) {
            toast.error('Approve error', { position: 'bottom-right' })
            console.error(error)
          }
        } else {
          try {
            const depositRes: any = await crossDeposit(
              tokenInfo.address,
              utils.parseUnits(String(amount), tokenInfo.decimals).toHexString(),
              chainId,
              provider
            )
            addTransaction(depositRes, {
              summary: `Cross Deposit`
            })
            setTriggerDataPoll(true)
            delayedFetchUserData()
          } catch (error) {
            toast.error('Deposit error', { position: 'bottom-right' })
            console.error(error)
          }
        }
      },
      deriveMaxFrom: 'available'
    },
    {
      name: 'Withdraw',
      onClick: async (tokenInfo: AccountBalanceData, amount: number) => {
        if (!chainId) return
        try {
          const response: any = await crossWithdraw(
            tokenInfo.address,
            utils.parseUnits(String(amount), tokenInfo.decimals).toHexString(),
            chainId,
            provider
          )
          addTransaction(response, {
            summary: `Cross Withdraw`
          })
          setTriggerDataPoll(true)
          delayedFetchUserData()
        } catch (error) {
          toast.error('Withdrawal error', { position: 'bottom-right' })
          console.error(error)
        }
      },
      deriveMaxFrom: 'maxWithdraw',
      disabled: (token: AccountBalanceData) => {
        const date = localStorage.getItem(`${token.coin}_LAST_DEPOSIT`)
        return !!date && new Date().getTime() - new Date(date).getTime() < 300000
      }
    }
  ] as const

  useEffect(() => {
    const tokensToSet = tokensList.tokens.filter(t => t.chainId === chainId)
    setTokens(tokensToSet)
    setTokenApprovalStates(tokens.reduce((ts, t) => ({ ...ts, [t.address]: false }), {}))
  }, [tokensList, chainId])

  /**
   *
   *
   * Get market data
   * @description fetches the data related to the MarginSwap market via polling
   *
   */
  const getMarketData = async () => {
    if (!chainId || !account) return

    const [_interestRates, _liquidities, _holdingTotal, _debtTotal] = await Promise.all([
      // interest rates by token
      getBorrowInterestRates(
        tokens.map(token => token.address),
        chainId,
        provider
      ),
      // liquidities (max lending available by token)
      Promise.all(
        tokens.map(async token => {
          const tokenToken = new Token(chainId, token.address, token.decimals)
          return new TokenAmount(
            tokenToken,
            ((await totalLendingAvailable(token.address, chainId, provider)) ?? utils.parseUnits('0')).toString()
          )
        })
      ),
      // holding total (sum of all account balances)
      new TokenAmount(getPegCurrency(chainId), (await getAccountHoldingTotal(account, chainId, provider)).toString()),
      // debt total (sum of all debt balances)
      new TokenAmount(getPegCurrency(chainId), (await getAccountBorrowTotal(account, chainId, provider)).toString())
    ])
    // interest rates by token
    setBorrowAPRs(
      Object.keys(_interestRates).reduce(
        (acc, cur) => ({ ...acc, [cur]: BigNumber.from(_interestRates[cur]).toNumber() * 0.01 }),
        {}
      )
    )
    // liquidities (max lending available by token)
    setLiquidities(_liquidities.reduce((acc, cur, index) => ({ ...acc, [tokens[index].address]: cur }), {}))
    // holding total (sum of all account balances)
    setHoldingTotal(_holdingTotal)
    // debt total (sum of all debt balances)
    setDebtTotal(_debtTotal)
  }

  // these next two useEffect hooks handle data polling
  useEffect(() => {
    if (triggerDataPoll && library && tokens.length) {
      try {
        setTriggerDataPoll(false)
        getMarketData()
      } catch (e) {
        console.error(e)
        setError('Failed to get account data')
      }
    }
  }, [triggerDataPoll, library, tokens])

  useEffect(() => {
    const interval = setInterval(() => setTriggerDataPoll(true), DATA_POLLING_INTERVAL)
    setPollingInterval(interval)

    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval)
      }
    }
  }, [])

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
      getAccountBalances(account, chainId, provider),
      // which tokens have approved the marginswap contract
      getTokenAllowances(
        account,
        tokens.map(token => token.address),
        chainId,
        provider
      ),
      // borrowable amounts (max borrowable by token)
      Promise.all(
        tokens.map(async token => {
          const tokenToken = new Token(chainId, token.address, token.decimals)
          const bipString = await borrowableInPeg(account, chainId, provider)
          const bip = new TokenAmount(getPegCurrency(chainId), bipString)

          if (bip) {
            return new TokenAmount(
              tokenToken,
              ((await valueInPeg2token(bip, tokenToken, chainId, provider)) ?? utils.parseUnits('0')).toString()
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
          const wipString = await withdrawableInPeg(account, chainId, provider)
          const wip = new TokenAmount(getPegCurrency(chainId), wipString)

          if (wip) {
            const tokenAmount = (
              (await valueInPeg2token(wip, tokenToken, chainId, provider)) ?? utils.parseUnits('0')
            ).toString()

            return new TokenAmount(tokenToken, tokenAmount)
          } else {
            return new TokenAmount(tokenToken, '0')
          }
        })
      ),
      // wallet token balances
      Promise.all(tokens.map(token => getTokenBalance(account, token.address, provider))),
      // holding total (sum of all account balances)
      new TokenAmount(getPegCurrency(chainId), (await getAccountHoldingTotal(account, chainId, provider)).toString()),
      // debt total (sum of all debt balances)
      new TokenAmount(getPegCurrency(chainId), (await getAccountBorrowTotal(account, chainId, provider)).toString())
    ])

    /*** now set the state for all that data ***/

    // margin account equity balances
    setHoldingAmounts(
      Object.keys(_balances.holdingAmounts).reduce(
        (acc, cur) => ({ ...acc, [cur]: BigNumber.from(_balances.holdingAmounts[cur]).toString() }),
        {}
      )
    )
    // margin account debt balances
    setBorrowingAmounts(
      Object.keys(_balances.borrowingAmounts).reduce(
        (acc, cur) => ({ ...acc, [cur]: BigNumber.from(_balances.borrowingAmounts[cur]).toString() }),
        {}
      )
    )
    // which tokens have approved the marginswap contract
    setAllowances(
      _allowances.reduce(
        (acc: any, cur: any, index: number) => ({
          ...acc,
          [tokens[index].address]: Number(BigNumber.from(cur).toString())
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
  /**
   * ^^^ END Get User MarginSwap Data ^^^
   */

  // call getUserMarginswapData when relevant things change
  useEffect(() => {
    getUserMarginswapData()
  }, [account, tokens, chainId, provider?._address])

  // build an array of token data to display in the table
  const data = useMemo(
    () =>
      tokens.map(token => ({
        img: token.logoURI ?? '',
        coin: token.symbol,
        address: token.address,
        decimals: token.decimals,
        balance: Number(holdingAmounts[token.address] ?? 0) / Math.pow(10, token.decimals),
        borrowed: Number(borrowingAmounts[token.address] ?? 0) / Math.pow(10, token.decimals),
        borrowable: borrowableAmounts[token.address] ? parseFloat(borrowableAmounts[token.address].toFixed()) : 0,
        withdrawable: withdrawableAmounts[token.address] ? parseFloat(withdrawableAmounts[token.address].toFixed()) : 0,
        liquidity: liquidities[token.address] ? parseFloat(liquidities[token.address].toFixed()) : 0,
        maxBorrow: Math.min(
          borrowableAmounts[token.address] ? parseFloat(borrowableAmounts[token.address].toFixed()) : 0,
          liquidities[token.address] ? parseFloat(liquidities[token.address].toFixed()) : 0
        ),
        maxWithdraw: Math.min(
          withdrawableAmounts[token.address] ? parseFloat(withdrawableAmounts[token.address].toFixed()) : 0,
          Number(holdingAmounts[token.address] ?? 0) / Math.pow(10, token.decimals)
        ),
        ir: borrowAPRs[token.address],
        available: tokenBalances[token.address] ?? 0,
        getActionNameFromAmount: {
          Deposit: (amount: number) =>
            allowances[token.address] >= amount
              ? 'Confirm Transaction'
              : tokenApprovalStates[token.address]
              ? 'Approving'
              : 'Approve'
        },
        customActions:
          token.symbol === 'WETH' && eth === '1'
            ? ([
                {
                  name: 'Deposit ETH',
                  onClick: async (tokenInfo: AccountBalanceData, amount: number) => {
                    if (!amount || !chainId) return
                    try {
                      const depositRes: any = await crossDepositETH(
                        utils.parseUnits(String(amount), tokenInfo.decimals).toHexString(),
                        chainId,
                        provider
                      )
                      addTransaction(depositRes, {
                        summary: `Cross Deposit `
                      })
                      delayedFetchUserData()
                    } catch (error) {
                      toast.error('Deposit error', { position: 'bottom-right' })
                      console.error(error)
                    }
                  },
                  max: Number(userEthBalance?.toSignificant(6)) || 0
                },
                {
                  name: 'Withdraw ETH',
                  onClick: async (tokenInfo: AccountBalanceData, amount: number) => {
                    if (!chainId) return
                    try {
                      const response: any = await crossWithdrawETH(
                        utils.parseUnits(String(amount), tokenInfo.decimals).toHexString(),
                        chainId,
                        provider
                      )
                      addTransaction(response, {
                        summary: `Cross Withdraw ETH`
                      })
                      delayedFetchUserData()
                    } catch (error) {
                      toast.error('Withdrawal error', { position: 'bottom-right' })
                      console.error(error)
                    }
                  },
                  deriveMaxFrom: 'balance',
                  disabled: (token: AccountBalanceData) => {
                    const date = localStorage.getItem(`${token.coin}_LAST_DEPOSIT`)
                    return !!date && new Date().getTime() - new Date(date).getTime() < 300000
                  }
                }
              ] as const)
            : undefined
      })),
    [
      tokens,
      holdingAmounts,
      borrowingAmounts,
      borrowAPRs,
      allowances,
      borrowableAmounts,
      withdrawableAmounts,
      tokenBalances,
      userEthBalance
    ]
  )

  return (
    <StyledWrapperDiv>
      <StyledSectionDiv>
        {!account && <WarningBar>Wallet not connected</WarningBar>}
        {error && <ErrorBar>{error}</ErrorBar>}
        <StyledTableContainer>
          <InfoCard
            title="Total Account Balance"
            amount={holdingTotal.toSignificant()}
            withUnderlyingCard
            Icon={IconBanknotes}
          />
          <StyledMobileOnlyRow>
            <InfoCard title="Debt" amount={debtTotal.toSignificant()} small Icon={IconScales} />
            <InfoCard
              title="Equity"
              amount={
                holdingTotal.greaterThan(debtTotal) || holdingTotal.equalTo(debtTotal)
                  ? holdingTotal.subtract(debtTotal).toSignificant()
                  : `- ${debtTotal.subtract(holdingTotal).toSignificant()}`
              }
              color="secondary"
              small
              Icon={IconCoin}
            />
          </StyledMobileOnlyRow>
          <RiskMeter risk={getRisk(Number(holdingTotal.toSignificant()), Number(debtTotal.toSignificant()))} />
        </StyledTableContainer>
        <TokensTable
          title="Account balance"
          data={data}
          columns={ACCOUNT_COLUMNS}
          actions={ACCOUNT_ACTIONS}
          deriveEmptyFrom={['balance', 'borrowed']}
          idCol="coin"
        />
      </StyledSectionDiv>
    </StyledWrapperDiv>
  )
}
