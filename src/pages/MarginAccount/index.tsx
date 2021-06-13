import React, { useEffect, useState } from 'react'
import useParsedQueryString from 'hooks/useParsedQueryString'
import TokensTable from '../../components/TokensTable'
import InfoCard from '../../components/InfoCard'
import IconBanknotes from '../../icons/IconBanknotes'
import IconScales from '../../icons/IconScales'
import IconCoin from '../../icons/IconCoin'
import RiskMeter from '../../components/Riskmeter'
import VideoExplainerLink from '../../components/VideoExplainerLink'
import { useWeb3React } from '@web3-react/core'
import {
  crossDeposit,
  crossWithdraw,
  approveToFund,
  TokenAmount,
  crossBorrow,
  crossDepositETH,
  crossWithdrawETH
} from '@marginswap/sdk'
import { ErrorBar, WarningBar } from '../../components/Placeholders'
import { useActiveWeb3React } from '../../hooks'
import { getProviderOrSigner } from '../../utils'
import { StyledTableContainer } from './styled'
import { StyledMobileOnlyRow } from './styled'
import { StyledWrapperDiv } from './styled'
import { StyledSectionDiv } from './styled'
import { utils, constants } from 'ethers'
import { toast } from 'react-toastify'
import { useIsTransactionPending, useTransactionAdder } from '../../state/transactions/hooks'
import { getPegCurrency, USDT_MAINNET } from '../../constants'
import { setInterval } from 'timers'
import { useETHBalances } from 'state/wallet/hooks'
import tokensList from '../../constants/tokenLists/marginswap-default.tokenlist.json'
import { TransactionDetails } from '../../state/transactions/reducer'

import { useMarketData, useUserMarginswapData } from './hooks'

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
  {
    name: 'Total Balance',
    id: 'balance',
    // eslint-disable-next-line react/display-name
    render: ({ balance }: { balance: number }) => <span>{balance ? balance.toFixed(2) : 0}</span>
  },
  {
    name: 'Debt',
    id: 'borrowed',
    // eslint-disable-next-line react/display-name
    render: ({ borrowed }: { borrowed: number }) => <span>{borrowed ? borrowed.toFixed(2) : 0}</span>
  },
  {
    name: 'Interest',
    id: 'ir',
    // eslint-disable-next-line react/display-name
    render: ({ ir }: { ir: number }) => <span>{ir ? `${ir.toFixed(2)}%` : 0}</span>,
    tooltip: 'Interest will start accruing per block as soon as a token is borrowed for a margin trade'
  },
  {
    name: 'Borrowable',
    id: 'borrowable',
    tooltip: 'This is the total amount you can borrow with your equity',
    // eslint-disable-next-line react/display-name
    render: ({ borrowable }: { borrowable: number }) => <span>{borrowable ? borrowable.toFixed(2) : 0}</span>
  },
  {
    name: 'Liquidity',
    id: 'liquidity',
    tooltip: 'This is the total amount of an asset available to be borrowed for a trade',
    // eslint-disable-next-line react/display-name
    render: ({ liquidity }: { liquidity: number }) => <span>{liquidity ? liquidity.toFixed(2) : 0}</span>
  }
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

  const [pollingInterval, setPollingInterval] = useState<ReturnType<typeof setInterval> | null>()
  const [triggerDataPoll, setTriggerDataPoll] = useState<boolean>(true)
  const [pendingTxhHash, setPendingTxhHash] = useState<string | null>()

  const { account } = useWeb3React()
  const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? '']
  const isTxnPending = useIsTransactionPending(pendingTxhHash || '')

  const addTransactionResponseCallback = (responseObject: TransactionDetails) => {
    setPendingTxhHash(responseObject.hash)
  }
  const addTransaction = useTransactionAdder(addTransactionResponseCallback)

  let provider: any
  if (library && account) {
    provider = getProviderOrSigner(library, account)
  }
  const tokens = tokensList.tokens.filter(t => t.chainId === chainId)

  const {
    borrowAPRs: borrowAPRsRetrieved,
    liquidities: liquiditiesRetrieved,
    holdingTotal: holdingTotalRetrieved,
    debtTotal: debtTotalRetrieved
  } = useMarketData({ chainId, provider, tokens, account })

  const {
    amounts: amountsRetrieved,
    allowances: allowancesRetrieved,
    borrowableAmounts: borrowableAmountsRetrieved,
    withdrawableAmounts: withdrawableAmountsRetrieved,
    tokenBalances: tokenBalancesRetrieved,
    holdingTotal: holdingTotalRetreived,
    debtTotal: debtTotalRetreived
  } = useUserMarginswapData({ chainId, provider, tokens, account })

  const borrowAPRs = (borrowAPRsRetrieved?.data as Record<string, number>) || null
  const liquidities = (liquiditiesRetrieved?.data as Record<string, number>) || null
  const holdingTotal =
    (holdingTotalRetrieved?.data as TokenAmount) || new TokenAmount(getPegCurrency(chainId) ?? USDT_MAINNET, '0')
  const debtTotal =
    (debtTotalRetrieved?.data as TokenAmount) || new TokenAmount(getPegCurrency(chainId) ?? USDT_MAINNET, '0')

  const holdingAmounts = (amountsRetrieved?.data?.holdingAmounts as Record<string, number>) || null
  const borrowingAmounts = (amountsRetrieved?.data?.borrowingAmounts as Record<string, number>) || null
  const allowances = (allowancesRetrieved?.data as Record<string, number>) || null
  const borrowableAmounts = (borrowableAmountsRetrieved?.data as Record<string, number>) || null
  const withdrawableAmounts = (withdrawableAmountsRetrieved?.data as Record<string, TokenAmount>) || null
  const tokenBalances = (tokenBalancesRetrieved?.data as Record<string, number>) || null
  //const holdingTotal = (holdingTotalRetreived?.data as TokenAmount) || null
  //const debtTotal = (debtTotalRetrieved?.data as TokenAmount) || null

  useEffect(() => {
    if (!isTxnPending && pendingTxhHash) {
      setPendingTxhHash(null)
    }
  }, [isTxnPending])

  const BORROW_ACCOUNT_ACTION = [
    {
      name: 'Borrow',
      onClick: async (token: AccountBalanceData, amount: number) => {
        if (!amount || !chainId) return
        try {
          const res: any = await crossBorrow(
            token.address,
            utils.parseUnits(String(amount), token.decimals).toHexString(),
            chainId,
            provider
          )
          addTransaction(res, {
            summary: `Borrow`
          })
          setTriggerDataPoll(true)
          //getUserMarginswapData()
        } catch (e) {
          toast.error('Borrow error', { position: 'bottom-right' })
          console.error(error)
        }
      },
      deriveMaxFrom: 'maxBorrow'
    }
  ]

  const ACCOUNT_ACTIONS: any = [
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
        if (!amount || !chainId) return
        if (allowances[tokenInfo.address] <= 0) {
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
            //delayedFetchUserData()
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
            //delayedFetchUserData()
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
          //delayedFetchUserData()
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

  if (triggerDataPoll && library && tokens.length) {
    try {
      setTriggerDataPoll(false)
    } catch (e) {
      console.error(e)
      setError('Failed to get account data')
    }
  }

  useEffect(() => {
    const interval = setInterval(() => setTriggerDataPoll(true), DATA_POLLING_INTERVAL)
    setPollingInterval(interval)

    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval)
      }
    }
  }, [])

  // build an array of token data to display in the table
  const data = tokens.map(token => ({
    img: token.logoURI ?? '',
    coin: token.symbol,
    address: token.address,
    decimals: token.decimals,
    balance: holdingAmounts ? Number(holdingAmounts[token.address] ?? 0) / Math.pow(10, token.decimals) : 0,
    borrowed: borrowingAmounts ? Number(borrowingAmounts[token.address] ?? 0) / Math.pow(10, token.decimals) : 0,
    borrowable:
      borrowableAmounts && borrowableAmounts[token.address]
        ? parseFloat(borrowableAmounts[token.address].toFixed())
        : 0,
    withdrawable:
      withdrawableAmounts && withdrawableAmounts[token.address]
        ? parseFloat(withdrawableAmounts[token.address].toFixed())
        : 0,
    liquidity: liquidities && liquidities[token.address] ? parseFloat(liquidities[token.address].toFixed()) : 0,
    maxBorrow: Math.min(
      borrowableAmounts && borrowableAmounts[token.address]
        ? parseFloat(borrowableAmounts[token.address].toFixed())
        : 0,
      liquidities && liquidities[token.address] ? parseFloat(liquidities[token.address].toFixed()) : 0
    ),
    maxWithdraw: Math.min(
      withdrawableAmounts && withdrawableAmounts[token.address]
        ? parseFloat(withdrawableAmounts[token.address].toFixed())
        : 0,
      holdingAmounts ? Number(holdingAmounts[token.address] ?? 0) / Math.pow(10, token.decimals) : 0
    ),
    ir: borrowAPRs ? borrowAPRs[token.address] : 0,
    available: (tokenBalances && tokenBalances[token.address]) ?? 0,
    getActionNameFromAmount: {
      Deposit: () => (allowances[token.address] > 0 ? 'Confirm Transaction' : 'Approve')
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
                  //delayedFetchUserData()
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
                  //delayedFetchUserData()
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
  }))

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
          actions={chainId !== 1 ? [...ACCOUNT_ACTIONS, ...BORROW_ACCOUNT_ACTION] : ACCOUNT_ACTIONS}
          deriveEmptyFrom={['balance', 'borrowed']}
          idCol="coin"
          isTxnPending={!!pendingTxhHash}
        />
        <VideoExplainerLink />
      </StyledSectionDiv>
    </StyledWrapperDiv>
  )
}
