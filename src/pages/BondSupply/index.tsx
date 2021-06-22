import React, { useState, useEffect, useMemo } from 'react'
import TokensTable from '../../components/TokensTable'
import InfoCard from '../../components/InfoCard'
import VideoExplainerLink from '../../components/VideoExplainerLink'
import IconMoneyStackLocked from '../../icons/IconMoneyStackLocked'
import IconMoneyStack from '../../icons/IconMoneyStack'
import { TokenInfo } from '@uniswap/token-lists'
import { useWeb3React } from '@web3-react/core'
import { getDefaultProvider } from '@ethersproject/providers'
import { useActiveWeb3React } from '../../hooks'
import { getProviderOrSigner } from '../../utils'
import {
  getHourlyBondBalances,
  getHourlyBondInterestRates,
  getHourlyBondMaturities,
  buyHourlyBondSubscription,
  getBondsCostInDollars,
  withdrawHourlyBond,
  approveToFund,
  TokenAmount,
  getTokenAllowances,
  getTokenBalance
} from '@marginswap/sdk'
import { ErrorBar, WarningBar } from '../../components/Placeholders'
import { BigNumber } from '@ethersproject/bignumber'
import { StyledTableContainer, StyledWrapperDiv, StyledSectionDiv } from './styled'
import { utils, constants } from 'ethers'
import { toast } from 'react-toastify'
import { useTransactionAdder, useIsTransactionPending } from '../../state/transactions/hooks'
import { getPegCurrency, USDT_MAINNET } from '../../constants'
import { setInterval } from 'timers'
import tokensList from '../../constants/tokenLists/marginswap-default.tokenlist.json'
import { TransactionDetails } from '../../state/transactions/reducer'
import { NETWORK_URLS } from '../../constants/networks'

const DATA_POLLING_INTERVAL = 60 * 1000

type BondRateData = {
  img: string
  coin: string
  address: string
  decimals: number
  totalSupplied: number
  apy: number
  maturity: number
  available: number
}

const BOND_RATES_COLUMNS = [
  {
    name: 'Coin',
    id: 'coin',
    // eslint-disable-next-line react/display-name
    render: (token: BondRateData) => (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img src={token.img} alt={token.coin} height={30} />
        <span style={{ marginLeft: '5px' }}>{token.coin}</span>
      </div>
    )
  },
  {
    name: 'Total Supplied',
    id: 'totalSupplied',
    // eslint-disable-next-line react/display-name
    render: ({ totalSupplied }: { totalSupplied: number }) => (
      <span>{totalSupplied ? totalSupplied.toFixed(2) : 0}</span>
    )
  },
  {
    name: 'APY',
    id: 'apy',
    // eslint-disable-next-line react/display-name
    render: ({ apy }: { apy: number }) => <span>{apy ? `${apy.toFixed(2)}%` : 0}</span>
  },
  { name: 'Maturity (minutes remaining)', id: 'maturity' }
] as const

const apyFromApr = (apr: number, compounds: number): number =>
  (Math.pow(1 + apr / (compounds * 100), compounds) - 1) * 100

export const BondSupply = () => {
  const { library, chainId } = useActiveWeb3React()
  const [error, setError] = useState<string | null>(null)

  const [tokens, setTokens] = useState<TokenInfo[]>([])
  const [bondBalances, setBondBalances] = useState<Record<string, string>>({})
  const [bondAPRs, setBondAPRs] = useState<Record<string, number>>({})
  const [bondMaturities, setBondMaturities] = useState<Record<string, number>>({})
  const [bondUSDCosts, setBondUSDCosts] = useState<Record<string, TokenAmount>>({})
  const [allowances, setAllowances] = useState<Record<string, number>>({})
  const [tokenBalances, setTokenBalances] = useState<Record<string, number>>({})
  const [pollingInterval, setPollingInterval] = useState<ReturnType<typeof setInterval> | null>()
  const [triggerDataPoll, setTriggerDataPoll] = useState<boolean>(true)
  const [pendingTxhHash, setPendingTxhHash] = useState<string | null>()

  useEffect(() => {
    setTokens(tokensList.tokens.filter(t => t.chainId === chainId))
  }, [])

  const { account } = useWeb3React()
  const isTxnPending = useIsTransactionPending(pendingTxhHash || '')

  const addTransactionResponseCallback = (responseObject: TransactionDetails) => {
    setPendingTxhHash(responseObject.hash)
  }

  const delayedFetchUserData = () => {
    setTimeout(() => {
      getUserMarginswapData()
      getMarketData()
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

  const queryProvider = getDefaultProvider(chainId && NETWORK_URLS[chainId])

  /**
   *
   *
   * Get market data
   * @description fetches the data related to the MarginSwap market via polling
   *
   */
  const getMarketData = async () => {
    const pegCurrency = getPegCurrency(chainId)
    if (!chainId || !account || !pegCurrency) return

    const [_interestRates, _maturities, _bondCosts] = await Promise.all([
      getHourlyBondInterestRates(
        tokens.map(t => t.address),
        chainId,
        queryProvider
      ),
      getHourlyBondMaturities(
        account,
        tokens.map(t => t.address),
        chainId,
        queryProvider
      ),
      getBondsCostInDollars(
        account,
        tokens.map(t => t.address),
        chainId,
        queryProvider
      )
    ])

    /*** now set the state for all that data ***/
    setBondAPRs(
      Object.keys(_interestRates).reduce(
        (acc, cur) => ({ ...acc, [cur]: BigNumber.from(_interestRates[cur]).toNumber() / 100 }),
        {}
      )
    )
    setBondMaturities(
      Object.keys(_maturities).reduce(
        (acc, cur) => ({ ...acc, [cur]: Math.ceil(BigNumber.from(_maturities[cur]).toNumber() / 60) }),
        {}
      )
    )
    setBondUSDCosts(
      Object.keys(_bondCosts).reduce(
        (acc, cur) => ({ ...acc, [cur]: new TokenAmount(pegCurrency, _bondCosts[cur].toString()) }),
        {}
      )
    )
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
    const [_balances, _allowances, _tokenBalances] = await Promise.all([
      getHourlyBondBalances(
        account,
        tokens.map(t => t.address),
        chainId,
        queryProvider
      ),
      getTokenAllowances(
        account,
        tokens.map(t => t.address),
        chainId,
        queryProvider
      ),
      Promise.all(tokens.map(token => getTokenBalance(account, token.address, queryProvider)))
    ])

    /*** now set the state for all that data ***/
    setBondBalances(
      Object.keys(_balances).reduce((acc, cur) => ({ ...acc, [cur]: BigNumber.from(_balances[cur]).toString() }), {})
    )
    setAllowances(
      _allowances.reduce(
        (acc: any, cur: any, index: number) => ({
          ...acc,
          [tokens[index].address]: Number(BigNumber.from(cur).toString())
        }),
        {}
      )
    )
    setTokenBalances(
      _tokenBalances.reduce(
        (acc, cur, index) => ({
          ...acc,
          [tokens[index].address]: Number(utils.formatUnits(_tokenBalances[index], tokens[index].decimals))
        }),
        {}
      )
    )
  }
  /**
   * ^^^ END Get User MarginSwap Data ^^^
   */

  // call getUserMarginswapData when relevant things change
  useEffect(() => {
    getUserMarginswapData()
  }, [account, tokens, chainId])

  const actions = [
    {
      name: 'Deposit',
      onClick: async (token: BondRateData, amount: number) => {
        if (!amount || !chainId) return
        if (allowances[token.address] <= 0) {
          try {
            const approveRes: any = await approveToFund(
              token.address,
              constants.MaxUint256.toHexString(),
              chainId,
              provider
            )
            addTransaction(approveRes, {
              summary: `Approve`
            })
            delayedFetchUserData()
          } catch (e) {
            toast.error('Approve error', { position: 'bottom-right' })
            console.error(e)
          }
        } else {
          try {
            const response: any = await buyHourlyBondSubscription(
              token.address,
              utils.parseUnits(String(amount), token.decimals).toHexString(),
              chainId,
              provider
            )
            addTransaction(response, {
              summary: `Buy HourlyBond Subscription`
            })
            delayedFetchUserData()
          } catch (e) {
            toast.error('Deposit error', { position: 'bottom-right' })
            console.error(e)
          }
        }
      },
      deriveMaxFrom: 'available'
    },
    {
      name: 'Withdraw',
      onClick: async (token: BondRateData, amount: number) => {
        if (!amount) return
        try {
          const response: any = await withdrawHourlyBond(
            token.address,
            utils.parseUnits(String(amount), token.decimals).toHexString(),
            chainId,
            provider
          )
          addTransaction(response, {
            summary: `Withdraw HourlyBond`
          })
          delayedFetchUserData()
        } catch (e) {
          toast.error('Withdrawal error', { position: 'bottom-right' })
          console.error(e)
        }
      },
      deriveMaxFrom: 'totalSupplied'
    }
  ] as const

  const data = useMemo(
    () =>
      tokens.map(token => ({
        img: token.logoURI ?? '',
        address: token.address,
        decimals: token.decimals,
        coin: token.symbol,
        totalSupplied: Number(bondBalances[token.address] ?? 0) / Math.pow(10, token.decimals),
        apy: apyFromApr(bondAPRs[token.address] ?? 0, 365 * 24),
        maturity: bondMaturities[token.address] ?? 0,
        available: tokenBalances[token.address],
        getActionNameFromAmount: {
          Deposit: () => (allowances[token.address] > 0 ? 'Confirm Transaction' : 'Approve')
        }
      })),
    [tokens, bondBalances, bondMaturities, allowances]
  )

  const pegCurrency = getPegCurrency(chainId) ?? USDT_MAINNET
  const ZERO_DAI = new TokenAmount(pegCurrency, '0')

  const averageYield = useMemo(() => {
    // get the total balance of all the user's bonds
    const bondCosts = tokens.reduce(
      (acc, cur) => acc + Number((bondUSDCosts[cur.address] ?? ZERO_DAI).toSignificant()),
      0
    )
    if (bondCosts === 0) return 0
    const avgYield = tokens.reduce((acc, cur) => {
      const apy = apyFromApr(bondAPRs[cur.address], 365 * 24)
      // Multiply the bond APRs by the number of dollars in that bond, then divide by the total of all bond balances.
      // Don't think about this as percentages - we're just averaging numbers.
      // Each dollar has an interest rate assigned to it, then we divide that by the total number of dollars
      // to get the average interest rate for all dollars
      return acc + (apy * Number(bondUSDCosts[cur.address].toSignificant(4))) / bondCosts
    }, 0)
    return avgYield.toFixed(2)
  }, [tokens, bondAPRs, bondUSDCosts])

  const earningsPerDay = useMemo(() => {
    if (!Object.keys(bondUSDCosts).length || !Object.keys(bondAPRs).length) {
      return 0
    }

    const totalAnnualEarnings = tokens.reduce((acc, cur) => {
      const apy = apyFromApr(bondAPRs[cur.address], 365 * 24)
      const bondBalance = Number(bondUSDCosts[cur.address].toSignificant(4))

      if (apy > 0 && bondBalance > 0) {
        return acc + (apy / 100) * bondBalance
      }

      return acc
    }, 0)

    if (totalAnnualEarnings === 0) {
      return 0
    }

    return (totalAnnualEarnings / 365).toFixed(2)
  }, [tokens, bondAPRs, bondUSDCosts])

  return (
    <StyledWrapperDiv>
      <StyledSectionDiv>
        {!account && <WarningBar>Wallet not connected</WarningBar>}
        {error && <ErrorBar>{error}</ErrorBar>}
        <StyledTableContainer>
          <InfoCard
            title="Total Bond"
            amount={`$${Object.keys(bondUSDCosts)
              .reduce((acc, cur) => acc.add(bondUSDCosts[cur]), ZERO_DAI)
              .toSignificant()}`}
            Icon={IconMoneyStackLocked}
          />
          <InfoCard title="Average Yield" amount={`${averageYield}%`} ghost Icon={IconMoneyStackLocked} />
          <InfoCard
            title="Earnings per day"
            amount={`$${earningsPerDay}`}
            color="secondary"
            ghost
            Icon={IconMoneyStack}
          />
        </StyledTableContainer>
        <TokensTable
          title="Bond Rates"
          data={data}
          columns={BOND_RATES_COLUMNS}
          idCol="coin"
          actions={actions}
          isTxnPending={!!pendingTxhHash}
        />
        <VideoExplainerLink />
      </StyledSectionDiv>
    </StyledWrapperDiv>
  )
}

export default BondSupply
