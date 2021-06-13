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
import { crossDeposit, crossWithdraw, approveToFund, TokenAmount, crossBorrow } from '@marginswap/sdk'
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
import { getData, AccountBalanceData, getRisk, DATA_POLLING_INTERVAL } from './utils'

import { useMarketData, useUserMarginswapData } from './hooks'

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

  if (triggerDataPoll && library && tokens.length) {
    try {
      setTriggerDataPoll(false)
    } catch (e) {
      console.error(e)
      setError('Failed to get account data')
    }
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

  useEffect(() => {
    if (!isTxnPending && pendingTxhHash) {
      setPendingTxhHash(null)
    }
  }, [isTxnPending])

  useEffect(() => {
    const interval = setInterval(() => setTriggerDataPoll(true), DATA_POLLING_INTERVAL)
    setPollingInterval(interval)

    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval)
      }
    }
  }, [])

  const data = getData({
    chainId,
    provider,
    tokens,
    eth,
    holdingAmounts,
    borrowingAmounts,
    borrowableAmounts,
    withdrawableAmounts,
    liquidities,
    borrowAPRs,
    tokenBalances,
    allowances,
    addTransaction,
    toast,
    userEthBalance
  })

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
          data={data ?? []}
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
