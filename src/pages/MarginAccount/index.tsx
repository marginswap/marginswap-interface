import { makeStyles } from '@material-ui/core'
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
import { getAccountBalances, getAccountBorrowTotal, getAccountHoldingTotal, Token, crossDeposit } from '@marginswap/sdk'
import { TokenInfo } from '@uniswap/token-lists'
import { ErrorBar, WarningBar } from '../../components/Placeholders'
import { useActiveWeb3React } from '../../hooks'
import { useTokenBalances } from '../../state/wallet/hooks'
import { getProviderOrSigner, getContract } from '../../utils'
import { BigNumber } from '@ethersproject/bignumber'
import { FUND_ADDRESS } from '../../constants'
import ERC20_INTERFACE from '../../constants/abis/erc20'
import { useMultipleContractSingleData } from '../../state/multicall/hooks'
import { MaxUint256 } from '@ethersproject/constants'
import { TransactionResponse } from '@ethersproject/providers'
import ERC20_ABI from '../../constants/abis/erc20.json'
import { utils } from 'ethers'
import { useTransactionAdder } from '../../state/transactions/hooks'
const { REACT_APP_CHAIN_ID } = process.env

type AccountBalanceData = {
  img: string
  coin: string
  balance: number
  available: number
  borrowed: number
  isApproved?: boolean
  ir: number
}

const useStyles = makeStyles(() => ({
  wrapper: {
    display: 'flex',
    flexDirection: 'row',
    paddingLeft: '20px'
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    paddingRight: '20px',
    gap: '20px'
  }
}))

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

export const MarginAccount = () => {
  const classes = useStyles()
  const [error, setError] = useState<string | null>(null)

  const lists = useAllLists()
  const fetchList = useFetchListCallback()
  const [tokens, setTokens] = useState<TokenInfo[]>([])
  const [holdingAmounts, setHoldingAmounts] = useState<Record<string, number>>({})
  const [borrowingAmounts, setBorrowingAmounts] = useState<Record<string, number>>({})
  const [holdingTotal, setHoldingTotal] = useState(0)
  const [debtTotal, setDebtTotal] = useState(0)

  const { account } = useWeb3React()
  const { library } = useActiveWeb3React()

  const addTransaction = useTransactionAdder()

  let provider: any
  if (library && account) {
    provider = getProviderOrSigner(library, account)
  }

  const handleDeposit = async (address: string, amount: number) => {
    if (!amount) {
      // TODO: display something
      console.error('not enough amount')
      return
    }
    try {
      const res: any = await crossDeposit(
        address,
        utils.parseEther(String(amount)).toHexString(),
        Number(REACT_APP_CHAIN_ID),
        provider
      )
      addTransaction(res, {
        summary: `Cross Deposit`
      })
      console.log('res :>> ', res)
    } catch (error) {
      console.log('error :>> ', error)
    }
  }

  const handleApprove = (address: string) => {
    if (!address || !library || !account) return
    const tokenContract = getContract(address, ERC20_ABI, library, account)

    if (!tokenContract) {
      console.error('tokenContract is null')
      return
    }

    tokenContract
      .approve(FUND_ADDRESS, MaxUint256)
      .then((response: TransactionResponse) => {
        console.log('approve response :>> ', response)
        addTransaction(response, {
          summary: `Approve Fund`
        })
      })
      .catch((error: Error) => {
        console.debug('Failed to approve token', error)
        throw error
      })
  }

  const ACCOUNT_ACTIONS = [
    {
      name: 'Borrow',
      onClick: (token: AccountBalanceData, amount: number) => {
        console.log('borrow', token)
        console.log('amount :>> ', amount)
      },
      deriveMaxFrom: 'available'
    },
    {
      name: 'Repay',
      onClick: (token: AccountBalanceData, amount: number) => {
        console.log('repay', token)
        console.log('amount :>> ', amount)
      },
      deriveMaxFrom: 'available'
    },
    {
      name: 'Withdraw',
      onClick: (token: AccountBalanceData, amount: number) => {
        console.log('withdraw', token)
        console.log('amount :>> ', amount)
      },
      deriveMaxFrom: 'available'
    },
    {
      name: 'Deposit',
      onClick: (tokenInfo: AccountBalanceData, amount: number) => {
        const token = tokens.find(item => item.symbol === tokenInfo.coin)
        console.log('token :>> ', token)
        console.log('amount :>> ', amount)
        if (tokenInfo.isApproved) {
          handleDeposit(token?.address as string, amount)
        } else {
          handleApprove(token?.address as string)
        }
      },
      deriveMaxFrom: 'available'
    }
  ] as const

  const formattedTokens = useMemo(
    () =>
      tokens.length > 0
        ? tokens.map(token => new Token(token.chainId, token.address, token.decimals, token.symbol, token.name))
        : [],
    [tokens]
  )

  const tokenBalances = useTokenBalances(account ?? undefined, formattedTokens)

  const validatedTokenAddresses = useMemo(() => formattedTokens.map(vt => vt.address), [formattedTokens])

  const allowances = useMultipleContractSingleData(validatedTokenAddresses, ERC20_INTERFACE, 'allowance', [
    account ?? undefined,
    FUND_ADDRESS
  ])

  const getTokensList = async (url: string) => {
    const tokensRes = await fetchList(url, false)
    setTokens(tokensRes.tokens.filter(t => t.chainId === Number(REACT_APP_CHAIN_ID)))
  }
  useEffect(() => {
    getTokensList(Object.keys(lists)[0]).catch(e => {
      console.error(e)
      setError('Failed to get tokens list')
    })
  }, [lists])

  const getAccountData = async (_account: string) => {
    const [balances, _holdingTotal, _debtTotal] = await Promise.all([
      getAccountBalances(_account, Number(REACT_APP_CHAIN_ID), provider),
      getAccountHoldingTotal(_account, Number(REACT_APP_CHAIN_ID), provider),
      getAccountBorrowTotal(_account, Number(REACT_APP_CHAIN_ID), provider)
    ])
    const holdingTotal = Number(utils.formatEther(BigNumber.from(_holdingTotal)))
    const debtTotal = Number(utils.formatEther(BigNumber.from(_debtTotal)))
    setHoldingAmounts(
      Object.keys(balances.holdingAmounts).reduce(
        (acc, cur) => ({ ...acc, [cur]: BigNumber.from(balances.holdingAmounts[cur]).toNumber() }),
        {}
      )
    )
    setBorrowingAmounts(
      Object.keys(balances.borrowingAmounts).reduce(
        (acc, cur) => ({ ...acc, [cur]: BigNumber.from(balances.borrowingAmounts[cur]).toNumber() }),
        {}
      )
    )
    setHoldingTotal(Number(holdingTotal.toFixed(4)))
    setDebtTotal(Number(debtTotal.toFixed(4)))
  }
  useEffect(() => {
    if (account) {
      getAccountData(account).catch(e => {
        console.error(e)
        setError('Failed to get account data')
      })
    }
  }, [account])

  const data = useMemo(
    () =>
      tokens.map((token, index) => {
        return {
          img: token.logoURI ?? '',
          coin: token.symbol,
          balance: holdingAmounts[token.address] ?? 0,
          borrowed: borrowingAmounts[token.address] ?? 0,
          available: Number(tokenBalances[token.address]?.toSignificant(4)) ?? 0,
          isApproved: !allowances[index]?.result?.[0].isZero(),
          ir: 0 // TODO
        }
      }),
    [tokens, holdingAmounts, borrowingAmounts, tokenBalances, allowances]
  )

  const getRisk = (holding: number, debt: number): number => {
    if (debt === 0) return 0
    return Math.min(Math.max(((holding - debt) / debt - 1.1) * -41.6 + 10, 0), 10)
  }

  return (
    <div className={classes.wrapper}>
      <div className={classes.section}>
        {!account && <WarningBar>Wallet not connected</WarningBar>}
        {error && <ErrorBar>{error}</ErrorBar>}
        <div style={{ display: 'flex', justifyContent: 'space-between', margin: '20px 0', alignItems: 'center' }}>
          <InfoCard title="Total Account Balance" amount={holdingTotal} withUnderlyingCard Icon={IconBanknotes} />
          <InfoCard title="Debt" amount={debtTotal} small Icon={IconScales} />
          <InfoCard title="Equity" amount={holdingTotal - debtTotal} color="secondary" small Icon={IconCoin} />
          <RiskMeter risk={getRisk(holdingTotal, debtTotal)} />
        </div>
        <TokensTable
          title="Account balance"
          data={data}
          columns={ACCOUNT_COLUMNS}
          actions={ACCOUNT_ACTIONS}
          deriveEmptyFrom="balance"
          idCol="coin"
        />
      </div>
    </div>
  )
}
