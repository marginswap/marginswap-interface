import React, { useState, useEffect, useMemo } from 'react'
import TokensTable from '../../components/TokensTable'
import InfoCard from '../../components/InfoCard'
import VideoExplainerLink from '../../components/VideoExplainerLink'
import IconMoneyStackLocked from '../../icons/IconMoneyStackLocked'
import IconMoneyStack from '../../icons/IconMoneyStack'
import { TokenInfo } from '@uniswap/token-lists'
import { useWeb3React } from '@web3-react/core'
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
import { BOND_RATES_COLUMNS, DATA_POLLING_INTERVAL, BondRateDataType, apyFromApr } from './utils'
import { useMarketData } from './hooks'

export const BondSupply = () => {
  const { library, chainId } = useActiveWeb3React()

  const [error, setError] = useState<string | null>(null)
  //const [tokens, setTokens] = useState<TokenInfo[]>([])
  const [bondBalances, setBondBalances] = useState<Record<string, string>>({})
  //const [bondAPRs, setBondAPRs] = useState<Record<string, number>>({})
  //const [bondMaturities, setBondMaturities] = useState<Record<string, number>>({})
  //const [bondUSDCosts, setBondUSDCosts] = useState<Record<string, TokenAmount>>({})
  const [allowances, setAllowances] = useState<Record<string, number>>({})
  const [tokenBalances, setTokenBalances] = useState<Record<string, number>>({})
  const [pollingInterval, setPollingInterval] = useState<ReturnType<typeof setInterval> | null>()
  const [triggerDataPoll, setTriggerDataPoll] = useState<boolean>(true)
  const [pendingTxhHash, setPendingTxhHash] = useState<string | null>()
  /*useEffect(() => {
    setTokens(tokensList.tokens.filter(t => t.chainId === chainId))
  }, [])*/
  const { account } = useWeb3React()
  const isTxnPending = useIsTransactionPending(pendingTxhHash || '')

  const addTransactionResponseCallback = (responseObject: TransactionDetails) => {
    setPendingTxhHash(responseObject.hash)
  }
  const addTransaction = useTransactionAdder(addTransactionResponseCallback)

  let provider: any
  if (library && account) {
    provider = getProviderOrSigner(library, account)
  }
  const tokens: TokenInfo[] = tokensList.tokens.filter(t => t.chainId === chainId)
  const {
    bondAPRs: bondAPRsRetrieve,
    bondMaturities: bondMaturitiesRetrieve,
    bondUSDCosts: bondUSDCostsRetreive
  } = useMarketData({ chainId, provider, tokens, account })

  const bondAPRs = (bondAPRsRetrieve?.data as Record<string, number>) || null
  const bondMaturities = (bondMaturitiesRetrieve?.data as Record<string, number>) || null
  const bondUSDCosts = (bondUSDCostsRetreive?.data as Record<string, TokenAmount>) || null

  const delayedFetchUserData = () => {
    setTimeout(() => {
      getUserMarginswapData()
      //getMarketData()
    }, 2 * 1000)
  }

  //useEffect(() => {
  if (!isTxnPending && pendingTxhHash) {
    setPendingTxhHash(null)

    delayedFetchUserData()
  }
  //}, [isTxnPending])

  /**
   *
   *
   * Get market data
   * @description fetches the data related to the MarginSwap market via polling
   *
   */
  /*const getMarketData = async () => {
    const pegCurrency = getPegCurrency(chainId)
    if (!chainId || !account || !pegCurrency) return

    const [_interestRates, _maturities, _bondCosts] = await Promise.all([
      getHourlyBondInterestRates(
        tokens.map(t => t.address),
        chainId,
        provider
      ),
      getHourlyBondMaturities(
        account,
        tokens.map(t => t.address),
        chainId,
        provider
      ),
      getBondsCostInDollars(
        account,
        tokens.map(t => t.address),
        chainId,
        provider
      )
    ])*/

  /*** now set the state for all that data ***/
  /*setBondAPRs(
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
  }*/

  // these next two useEffect hooks handle data polling
  //useEffect(() => {
  if (triggerDataPoll && library && tokens.length) {
    try {
      setTriggerDataPoll(false)
      //getMarketData()
    } catch (e) {
      console.error(e)
      setError('Failed to get account data')
    }
  }
  //}, [triggerDataPoll, library, tokens])

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
        provider
      ),
      getTokenAllowances(
        account,
        tokens.map(t => t.address),
        chainId,
        provider
      ),
      Promise.all(tokens.map(token => getTokenBalance(account, token.address, provider)))
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
          [tokens[index].address]: Number(utils.formatUnits(_tokenBalances[index].toString(), tokens[index].decimals))
        }),
        {}
      )
    )
  }
  /**
   * ^^^ END Get User MarginSwap Data ^^^
   */

  // call getUserMarginswapData when relevant things change
  /*useEffect(() => {
    getUserMarginswapData()
  }, [account, tokens, chainId, provider?._address])*/

  const actions = [
    {
      name: 'Deposit',
      onClick: async (token: BondRateDataType, amount: number) => {
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
      onClick: async (token: BondRateDataType, amount: number) => {
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

  /*const data = useMemo(
    () =>
      tokens.map(token => ({
        img: token.logoURI ?? '',
        address: token.address,
        decimals: token.decimals,
        coin: token.symbol,
        totalSupplied: Number(bondBalances[token.address] ?? 0) / Math.pow(10, token.decimals),
        apy: bondAPRs ? apyFromApr(bondAPRs[token.address] ?? 0, 365 * 24) : 0,
        maturity: bondMaturities ? bondMaturities[token.address] ?? 0 : 0,
        available: tokenBalances[token.address],
        getActionNameFromAmount: {
          Deposit: () => (allowances[token.address] > 0 ? 'Confirm Transaction' : 'Approve')
        }
      })),
    [tokens, bondBalances, bondMaturities, allowances]
  )*/

  const getData = () =>
    tokens.map(token => ({
      img: token.logoURI ?? '',
      address: token.address,
      decimals: token.decimals,
      coin: token.symbol,
      totalSupplied: Number(bondBalances[token.address] ?? 0) / Math.pow(10, token.decimals),
      apy: bondAPRs ? apyFromApr(bondAPRs[token.address] ?? 0, 365 * 24) : 0,
      maturity: bondMaturities ? bondMaturities[token.address] ?? 0 : 0,
      available: tokenBalances[token.address],
      getActionNameFromAmount: {
        Deposit: () => (allowances[token.address] > 0 ? 'Confirm Transaction' : 'Approve')
      }
    }))
  const data = getData()

  const pegCurrency = getPegCurrency(chainId) ?? USDT_MAINNET
  const ZERO_DAI = new TokenAmount(pegCurrency, '0')

  const getAverageYield = () => {
    if (!bondUSDCosts) return 0
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
  }
  const averageYield = getAverageYield()
  /*const averageYield = useMemo(() => {
    if (!bondUSDCosts) return 0
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
  }, [tokens, bondAPRs, bondUSDCosts])*/

  const getEarningsPerDay = () => {
    if (!bondUSDCosts) return 0
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
  }
  const earningsPerDay = getEarningsPerDay()

  /*const earningsPerDay = useMemo(() => {
    if (!bondUSDCosts) return 0
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
  }, [tokens, bondAPRs, bondUSDCosts])*/

  return (
    <StyledWrapperDiv>
      <StyledSectionDiv>
        {!account && <WarningBar>Wallet not connected</WarningBar>}
        {error && <ErrorBar>{error}</ErrorBar>}
        <StyledTableContainer>
          <InfoCard
            title="Total Bond"
            amount={
              bondUSDCosts
                ? `$${Object.keys(bondUSDCosts)
                    .reduce((acc, cur) => acc.add(bondUSDCosts[cur]), ZERO_DAI)
                    .toSignificant()}`
                : 0
            }
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
