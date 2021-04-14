import { TokenAmount, Pair, Currency, AMMs } from '@marginswap/sdk'
import { useMemo } from 'react'
import { abi as IUniswapV2PairABI } from '@uniswap/v2-core/build/IUniswapV2Pair.json'
import { Interface } from '@ethersproject/abi'
import { useActiveWeb3React } from '../hooks'

import { useMultipleContractSingleData } from '../state/multicall/hooks'
import { wrappedCurrency } from '../utils/wrappedCurrency'

const PAIR_INTERFACE = new Interface(IUniswapV2PairABI)

export enum PairState {
  LOADING,
  NOT_EXISTS,
  EXISTS,
  INVALID
}

export function usePairs(currencies: [AMMs, Currency | undefined, Currency | undefined][]): [PairState, Pair | null][] {
  const { chainId } = useActiveWeb3React()

  const tokens = useMemo(
    () =>
      currencies.map(([amm, currencyA, currencyB]): [AMMs, any, any] => [
        amm,
        wrappedCurrency(currencyA, chainId),
        wrappedCurrency(currencyB, chainId)
      ]),
    [chainId, currencies]
  )

  const pairAddressesWithAmm = useMemo(
    () =>
      tokens.map(([amm, tokenA, tokenB]): [AMMs, string | undefined] => {
        return tokenA && tokenB && !tokenA.equals(tokenB)
          ? [amm, Pair.getAddress(tokenA, tokenB, amm)]
          : [amm, undefined]
      }),
    [tokens]
  )

  const pairAddresses = pairAddressesWithAmm.map(pair => pair[1])

  const results = useMultipleContractSingleData(pairAddresses, PAIR_INTERFACE, 'getReserves')

  return useMemo(() => {
    return results.map((result, i): [PairState, Pair | null] => {
      const { result: reserves, loading } = result
      const amm = pairAddressesWithAmm[i][0]
      const tokenA = tokens[i][1]
      const tokenB = tokens[i][2]
      let pairState: PairState
      let pair: Pair | null = null

      if (loading) {
        pairState = PairState.LOADING
      } else if (!tokenA || !tokenB || tokenA.equals(tokenB)) {
        pairState = PairState.INVALID
      } else if (!reserves) {
        pairState = PairState.NOT_EXISTS
      } else {
        const { reserve0, reserve1 } = reserves
        const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA]
        pairState = PairState.EXISTS
        pair = new Pair(new TokenAmount(token0, reserve0.toString()), new TokenAmount(token1, reserve1.toString()), amm)
      }

      return [pairState, pair]
    })
  }, [results, tokens])
}

export function usePair(amm: AMMs, tokenA?: Currency, tokenB?: Currency): [PairState, Pair | null][] {
  return usePairs([[amm, tokenA, tokenB]])
}
