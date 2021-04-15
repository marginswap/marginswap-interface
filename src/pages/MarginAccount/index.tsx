import React, { useEffect, useMemo, useState } from 'react'
import { useAllLists } from 'state/lists/hooks'
import { useFetchListCallback } from '../../hooks/useFetchListCallback'
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
  getHourlyBondInterestRates,
  getTokenAllowances,
  crossBorrow,
  borrowable,
  getTokenBalance
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

import { utils } from 'ethers'
import { toast } from 'react-toastify'
import { useTransactionAdder } from '../../state/transactions/hooks'
import { USDT } from '../../constants'

const chainId = Number(process.env.REACT_APP_CHAIN_ID)

type AccountBalanceData = {
  img: string
  coin: string
  decimals: number
  address: string
  balance: number
  borrowed: number
  borrowable: number
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
  // { name: 'Available', id: 'available' }, TODO
  { name: 'Borrowed', id: 'borrowed' },
  { name: 'Interest Rate', id: 'ir' }
] as const

const getRisk = (holding: number, debt: number): number => {
  if (debt === 0) return 0
  return Math.min(Math.max(((holding - debt) / debt - 1.1) * -41.6 + 10, 0), 10)
}

export const MarginAccount = () => {
  const [error, setError] = useState<string | null>(null)

  const lists = useAllLists()
  const fetchList = useFetchListCallback()

  const [tokens, setTokens] = useState<TokenInfo[]>([])
  const [holdingAmounts, setHoldingAmounts] = useState<Record<string, number>>({})
  const [borrowingAmounts, setBorrowingAmounts] = useState<Record<string, number>>({})
  const [holdingTotal, setHoldingTotal] = useState(new TokenAmount(USDT, '0'))
  const [debtTotal, setDebtTotal] = useState(new TokenAmount(USDT, '0'))
  const [borrowAPRs, setBorrowAPRs] = useState<Record<string, number>>({})
  const [allowances, setAllowances] = useState<Record<string, number>>({})
  const [borrowableAmounts, setBorrowableAmounts] = useState<Record<string, number>>({})
  const [tokenBalances, setTokenBalances] = useState<Record<string, number>>({})

  const { account } = useWeb3React()
  const { library } = useActiveWeb3React()

  const addTransaction = useTransactionAdder()

  let provider: any
  if (library && account) {
    provider = getProviderOrSigner(library, account)
  }

  const ACCOUNT_ACTIONS = [
    {
      name: 'Borrow',
      onClick: async (token: AccountBalanceData, amount: number) => {
        if (!amount) return
        try {
          const res: any = await crossBorrow(
            token.address,
            utils.parseUnits(String(amount), token.decimals).toHexString(),
            chainId,
            provider
          )
          addTransaction(res, {
            summary: `Approve`
          })
          getData()
        } catch (e) {
          toast.error('Approve error', { position: 'bottom-right' })
          console.error(error)
        }
      },
      deriveMaxFrom: 'borrowable'
    },
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
        if (!amount) return
        if (allowances[tokenInfo.address] < amount) {
          try {
            const approveRes: any = await approveToFund(
              tokenInfo.address,
              utils.parseUnits(String(amount), tokenInfo.decimals).toHexString(),
              chainId,
              provider
            )
            addTransaction(approveRes, {
              summary: `Approve`
            })
            getData()
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
        } catch (error) {
          toast.error('Withdrawal error', { position: 'bottom-right' })
          console.error(error)
        }
      },
      deriveMaxFrom: 'balance'
    }
  ] as const

  const getTokensList = async (url: string) => {
    const tokensRes = await fetchList(url, false)
    setTokens(tokensRes.tokens.filter(t => t.chainId === chainId))
  }
  useEffect(() => {
    getTokensList(Object.keys(lists)[0]).catch(e => {
      console.error(e)
      setError('Failed to get tokens list')
    })
  }, [lists])

  const getAccountData = async (_account: string) => {
    const [
      balances,
      _holdingTotal,
      _debtTotal,
      interestRates,
      _allowances,
      _borrowableAmounts,
      _tokenBalances
    ] = await Promise.all([
      getAccountBalances(_account, chainId, provider),
      new TokenAmount(USDT, (await getAccountHoldingTotal(_account, chainId, provider)).toString()),
      new TokenAmount(USDT, (await getAccountBorrowTotal(_account, chainId, provider)).toString()),
      getHourlyBondInterestRates(
        tokens.map(token => token.address),
        chainId,
        provider
      ),
      getTokenAllowances(
        _account,
        tokens.map(token => token.address),
        chainId,
        provider
      ),
      Promise.all(tokens.map(token => borrowable(_account, token.address, chainId, provider))),
      Promise.all(tokens.map(token => getTokenBalance(_account, token.address, provider)))
    ])
    setTokenBalances(
      _tokenBalances.reduce(
        (acc, cur, index) => ({
          ...acc,
          [tokens[index].address]: Number(
            BigNumber.from(cur).div(BigNumber.from(10).pow(tokens[index].decimals)).toString()
          )
        }),
        {}
      )
    )
    setBorrowableAmounts(
      _borrowableAmounts.reduce(
        (acc, cur, index) => ({ ...acc, [tokens[index].address]: Number(BigNumber.from(cur).toString()) }),
        {}
      )
    )
    setHoldingAmounts(
      Object.keys(balances.holdingAmounts).reduce(
        (acc, cur) => ({ ...acc, [cur]: BigNumber.from(balances.holdingAmounts[cur]).toString() }),
        {}
      )
    )
    setBorrowingAmounts(
      Object.keys(balances.borrowingAmounts).reduce(
        (acc, cur) => ({ ...acc, [cur]: BigNumber.from(balances.borrowingAmounts[cur]).toString() }),
        {}
      )
    )
    setBorrowAPRs(
      Object.keys(interestRates).reduce(
        (acc, cur) => ({ ...acc, [cur]: (2 * BigNumber.from(interestRates[cur]).toNumber()) / 100000 }),
        {}
      )
    )
    setHoldingTotal(_holdingTotal)
    setDebtTotal(_debtTotal)
    setAllowances(
      _allowances.reduce(
        (acc, cur, index) => ({ ...acc, [tokens[index].address]: Number(BigNumber.from(cur).toString()) }),
        {}
      )
    )
  }
  const getData = () => {
    if (account && library && tokens.length > 0) {
      getAccountData(account).catch(e => {
        console.error(e)
        setError('Failed to get account data')
      })
    }
  }
  useEffect(getData, [account, library, tokens])

  const data = useMemo(
    () =>
      tokens.map(token => ({
        img: token.logoURI ?? '',
        coin: token.symbol,
        address: token.address,
        decimals: token.decimals,
        balance: Number(holdingAmounts[token.address] ?? 0) / Math.pow(10, token.decimals),
        borrowed: Number(borrowingAmounts[token.address] ?? 0) / Math.pow(10, token.decimals),
        borrowable: Number(borrowableAmounts[token.address] ?? 0) / Math.pow(10, token.decimals),
        ir: borrowAPRs[token.address],
        available: tokenBalances[token.address],
        getActionNameFromAmount: {
          Deposit: (amount: number) => (allowances[token.address] >= amount ? 'Confirm Transaction' : 'Approve')
        }
      })),
    [tokens, holdingAmounts, borrowingAmounts, borrowAPRs, allowances]
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
              amount={holdingTotal.subtract(debtTotal).toSignificant()}
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
          deriveEmptyFrom="balance"
          idCol="coin"
        />
      </StyledSectionDiv>
    </StyledWrapperDiv>
  )
}
