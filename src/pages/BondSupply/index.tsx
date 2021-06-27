import React, { useState, useEffect } from 'react'
import TokensTable from '../../components/TokensTable'
import InfoCard from '../../components/InfoCard'
import VideoExplainerLink from '../../components/VideoExplainerLink'
import IconMoneyStackLocked from '../../icons/IconMoneyStackLocked'
import IconMoneyStack from '../../icons/IconMoneyStack'
import { useWeb3React } from '@web3-react/core'
import { useActiveWeb3React } from '../../hooks'
import { getProviderOrSigner, TokenInfoWithCoingeckoId } from '../../utils'
import { buyHourlyBondSubscription, withdrawHourlyBond, approveToFund, TokenAmount } from '@marginswap/sdk'
import { ErrorBar, WarningBar } from '../../components/Placeholders'
import { StyledTableContainer, StyledWrapperDiv, StyledSectionDiv } from './styled'
import { utils, constants } from 'ethers'
import { toast } from 'react-toastify'
import { useTransactionAdder, useIsTransactionPending } from '../../state/transactions/hooks'
import { getPegCurrency, USDT_MAINNET } from '../../constants'
import { setInterval } from 'timers'
import tokensList from '../../constants/tokenLists/marginswap-default.tokenlist.json'
import { TransactionDetails } from '../../state/transactions/reducer'
import { BOND_RATES_COLUMNS, DATA_POLLING_INTERVAL, BondRateDataType, apyFromApr } from './utils'
import { useMarketData, useUserMarginswapData } from './hooks'

export const BondSupply = () => {
  const { library, chainId } = useActiveWeb3React()

  const [error, setError] = useState<string | null>(null)

  const [pollingInterval, setPollingInterval] = useState<ReturnType<typeof setInterval> | null>()
  const [triggerDataPoll, setTriggerDataPoll] = useState<boolean>(true)
  const [pendingTxhHash, setPendingTxhHash] = useState<string | null>()

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
  const tokens: TokenInfoWithCoingeckoId[] = tokensList.tokens.filter(t => t.chainId === chainId)

  const {
    bondAPRs: bondAPRsRetrieve,
    incentiveAPRs: incentiveAPRsRetrieve,
    bondMaturities: bondMaturitiesRetrieve,
    bondUSDCosts: bondUSDCostsRetreive
  } = useMarketData({ chainId, provider, tokens, account })

  const {
    bondBalances: bondBalancesRetreive,
    allowances: allowancesRetreive,
    tokenBalances: tokenBalancesRetreive
  } = useUserMarginswapData({ chainId, provider, tokens, account })

  const bondAPRs = (bondAPRsRetrieve?.data as Record<string, number>) || null
  const incentiveAPRs = (incentiveAPRsRetrieve?.data as Record<string, number>) || null
  const bondMaturities = (bondMaturitiesRetrieve?.data as Record<string, number>) || null
  const bondUSDCosts = (bondUSDCostsRetreive?.data as Record<string, TokenAmount>) || null

  const bondBalances = (bondBalancesRetreive?.data as Record<string, number>) || null
  const allowances = (allowancesRetreive?.data as Record<string, number>) || null
  const tokenBalances = (tokenBalancesRetreive?.data as Record<string, number>) || null

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

  useEffect(() => {
    if (!isTxnPending && pendingTxhHash) setPendingTxhHash(null)
  }, [isTxnPending])

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
            //delayedFetchUserData()
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
            //delayedFetchUserData()
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
          //delayedFetchUserData()
        } catch (e) {
          toast.error('Withdrawal error', { position: 'bottom-right' })
          console.error(e)
        }
      },
      deriveMaxFrom: 'totalSupplied'
    }
  ] as const

  const getData = () =>
    tokens.map(token => ({
      img: token.logoURI ?? '',
      address: token.address,
      decimals: token.decimals,
      coin: token.symbol,
      totalSupplied: bondBalances ? Number(bondBalances[token.address] ?? 0) / Math.pow(10, token.decimals) : 0,
      apy: bondAPRs ? apyFromApr(bondAPRs[token.address] ?? 0, 365 * 24) : 0,
      aprWithIncentive: bondAPRs && incentiveAPRs ? bondAPRs[token.address] + incentiveAPRs[token.address] : 0,
      maturity: bondMaturities ? bondMaturities[token.address] ?? 0 : 0,
      available: tokenBalances ? tokenBalances[token.address] : 0,
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
