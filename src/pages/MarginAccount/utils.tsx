import { TokenAmount, ChainId, crossDepositETH, crossWithdrawETH } from '@marginswap/sdk'
import { utils } from 'ethers'

export const LIQUIDATION_RATIO = 1.15
export const SAFE_RATIO = 2.5

export const getRisk = (holding: number, debt: number): number => {
  if (debt === 0) return 0
  const marginLevel = Math.max(Math.min(holding / debt, SAFE_RATIO), LIQUIDATION_RATIO)
  return 10 - 10 * ((marginLevel - LIQUIDATION_RATIO) / (SAFE_RATIO - LIQUIDATION_RATIO))
}

export const DATA_POLLING_INTERVAL = 60 * 1000

export type AccountBalanceData = {
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

type GetDataType = {
  chainId?: ChainId | undefined
  provider?: any | undefined
  tokens?: any[]
  eth?: any
  holdingAmounts?: Record<string, number>
  borrowingAmounts?: Record<string, number>
  borrowableAmounts?: Record<string, number>
  withdrawableAmounts?: Record<string, TokenAmount>
  liquidities?: Record<string, number>
  borrowAPRs?: Record<string, number>
  tokenBalances?: Record<string, number>
  allowances?: Record<string, number>
  addTransaction?: any
  toast?: any
  userEthBalance?: any
}

// build an array of token data to display in the table
export const getData = ({
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
}: GetDataType) =>
  tokens?.map(token => ({
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
      Deposit: () => (allowances && allowances[token.address] > 0 ? 'Confirm Transaction' : 'Approve')
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
