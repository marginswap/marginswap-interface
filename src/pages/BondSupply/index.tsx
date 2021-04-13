import React, { useState, useEffect, useMemo } from 'react'
import { useAllLists } from 'state/lists/hooks'
import { useFetchListCallback } from '../../hooks/useFetchListCallback'
import TokensTable from '../../components/TokensTable'
import InfoCard from '../../components/InfoCard'
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
  getTokenAllowances
} from '@marginswap/sdk'
import { ErrorBar, WarningBar } from '../../components/Placeholders'
import { BigNumber } from '@ethersproject/bignumber'
import { StyledTableContainer } from './styled'
import { StyledWrapperDiv } from './styled'
import { StyledSectionDiv } from './styled'
import { utils } from 'ethers'
import { toast } from 'react-toastify'
import { useTransactionAdder } from '../../state/transactions/hooks'
import { USDT } from '../../constants'

const { REACT_APP_CHAIN_ID } = process.env

type BondRateData = {
  img: string
  coin: string
  address: string
  decimals: number
  totalSupplied: number
  apy: number
  maturity: number
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
  { name: 'Total Supplied', id: 'totalSupplied' },
  { name: 'APY', id: 'apy' },
  { name: 'Maturity (minutes remaining)', id: 'maturity' }
] as const

const apyFromApr = (apr: number, compounds: number): number =>
  (Math.pow(1 + apr / (compounds * 100), compounds) - 1) * 100

export const BondSupply = () => {
  const [error, setError] = useState<string | null>(null)

  const lists = useAllLists()
  const fetchList = useFetchListCallback()
  const [tokens, setTokens] = useState<TokenInfo[]>([])
  const [bondBalances, setBondBalances] = useState<Record<string, string>>({})
  const [bondAPRs, setBondAPRs] = useState<Record<string, number>>({})
  const [bondMaturities, setBondMaturities] = useState<Record<string, number>>({})
  const [bondUSDCosts, setBondUSDCosts] = useState<Record<string, TokenAmount>>({})
  const [allowances, setAllowances] = useState<Record<string, number>>({})

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

  const { account } = useWeb3React()
  const { library } = useActiveWeb3React()

  const addTransaction = useTransactionAdder()
  let provider: any
  if (library && account) {
    provider = getProviderOrSigner(library, account)
  }

  const getBondsData = async (address: string, tokens: string[]) => {
    // TODO get chain id from somewhere other than the env variable. Perhaps the wallet/provider?
    const [balances, interestRates, maturities, bondCosts, _allowances] = await Promise.all([
      getHourlyBondBalances(address, tokens, Number(REACT_APP_CHAIN_ID), provider),
      getHourlyBondInterestRates(tokens, Number(REACT_APP_CHAIN_ID), provider),
      getHourlyBondMaturities(address, tokens, Number(REACT_APP_CHAIN_ID), provider),
      getBondsCostInDollars(address, tokens, Number(REACT_APP_CHAIN_ID), provider),
      getTokenAllowances(address, tokens, Number(REACT_APP_CHAIN_ID), provider)
    ])
    setBondBalances(
      Object.keys(balances).reduce((acc, cur) => ({ ...acc, [cur]: BigNumber.from(balances[cur]).toString() }), {})
    )
    setBondAPRs(
      Object.keys(interestRates).reduce(
        (acc, cur) => ({ ...acc, [cur]: BigNumber.from(interestRates[cur]).toNumber() / 100000 }),
        {}
      )
    )
    setBondMaturities(
      Object.keys(maturities).reduce(
        (acc, cur) => ({ ...acc, [cur]: Math.ceil(BigNumber.from(maturities[cur]).toNumber() / 60) }),
        {}
      )
    )
    setBondUSDCosts(
      Object.keys(bondCosts).reduce(
        (acc, cur) => ({ ...acc, [cur]: new TokenAmount(USDT, bondCosts[cur].toString()) }),
        {}
      )
    )
    setAllowances(
      _allowances.reduce((acc, cur, index) => ({ ...acc, [tokens[index]]: Number(BigNumber.from(cur).toString()) }), {})
    )
  }

  const getData = () => {
    if (account && library && tokens.length > 0) {
      getBondsData(
        account,
        tokens.map(t => t.address)
      ).catch(e => {
        console.error(e)
        setError('Failed to get account data')
      })
    }
  }
  useEffect(getData, [account, tokens, library])

  const actions = [
    {
      name: 'Deposit',
      onClick: async (token: BondRateData, amount: number) => {
        if (!amount) return
        if (allowances[token.address] < amount) {
          try {
            const approveRes: any = await approveToFund(
              token.address,
              utils.parseUnits(String(Number.MAX_SAFE_INTEGER), token.decimals).toHexString(),
              Number(REACT_APP_CHAIN_ID),
              provider
            )
            addTransaction(approveRes, {
              summary: `Approve`
            })
            getData()
          } catch (e) {
            toast.error('Approve error', { position: 'bottom-right' })
            console.error(e)
          }
        } else {
          try {
            const response: any = await buyHourlyBondSubscription(
              token.address,
              utils.parseUnits(String(amount), token.decimals).toHexString(),
              Number(REACT_APP_CHAIN_ID),
              provider
            )
            addTransaction(response, {
              summary: `Buy HourlyBond Subscription`
            })
          } catch (e) {
            toast.error('Deposit error', { position: 'bottom-right' })
            console.error(e)
          }
        }
      }
      // TODO: max
    },
    {
      name: 'Withdraw',
      onClick: async (token: BondRateData, amount: number) => {
        if (!amount) return
        try {
          const response: any = await withdrawHourlyBond(
            token.address,
            utils.parseUnits(String(amount), token.decimals).toHexString(),
            Number(REACT_APP_CHAIN_ID),
            provider
          )
          addTransaction(response, {
            summary: `Withdraw HourlyBond`
          })
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
        getActionNameFromAmount: {
          Deposit: (amount: number) => (allowances[token.address] >= amount ? 'Confirm Transaction' : 'Approve')
        }
      })),
    [tokens, bondBalances, bondMaturities, allowances]
  )
  const ZERO_DAI = new TokenAmount(USDT, '0')

  const averageYield = useMemo(() => {
    const bondCosts = tokens.reduce(
      (acc, cur) => acc + Number((bondUSDCosts[cur.address] ?? ZERO_DAI).toSignificant()),
      0
    )
    if (bondCosts === 0) return 0
    return tokens.reduce((acc, cur) => {
      const apy = apyFromApr(bondAPRs[cur.address], 365 * 24)
      return acc + (apy * Number(bondUSDCosts[cur.address].toSignificant(4))) / bondCosts
    }, 0)
  }, [tokens, bondAPRs, bondUSDCosts])

  return (
    <StyledWrapperDiv>
      <StyledSectionDiv>
        {!account && <WarningBar>Wallet not connected</WarningBar>}
        {error && <ErrorBar>{error}</ErrorBar>}
        <StyledTableContainer>
          <InfoCard
            title="Total Bond"
            amount={
              Number(
                Object.keys(bondUSDCosts)
                  .reduce((acc, cur) => acc.add(bondUSDCosts[cur]), ZERO_DAI)
                  .toSignificant()
              ) *
              10 ** 18
            }
            Icon={IconMoneyStackLocked}
          />
          <InfoCard title="Average Yield" amount={averageYield} ghost Icon={IconMoneyStackLocked} />
          <InfoCard
            title="Earnings per day"
            amount={
              Number(
                tokens
                  .reduce((acc, cur) => acc.add(bondUSDCosts[cur.address] ?? ZERO_DAI), ZERO_DAI)
                  .divide('365')
                  .toSignificant(4)
              ) *
              10 ** 18
            }
            color="secondary"
            ghost
            Icon={IconMoneyStack}
          />
        </StyledTableContainer>
        <TokensTable title="Bond Rates" data={data} columns={BOND_RATES_COLUMNS} idCol="coin" actions={actions} />
      </StyledSectionDiv>
    </StyledWrapperDiv>
  )
}

export default BondSupply
