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

export function usePairs(currencies: [Currency | undefined, Currency | undefined][]): [PairState, Pair | null][] {
  const { chainId } = useActiveWeb3React()

  const tokens = useMemo(
    () =>
      currencies.map(([currencyA, currencyB]) => [
        wrappedCurrency(currencyA, chainId),
        wrappedCurrency(currencyB, chainId)
      ]),
    [chainId, currencies]
  )

  const pairAddresses = useMemo(
    () =>
      tokens.flatMap(([tokenA, tokenB]) => {
        return tokenA && tokenB && !tokenA.equals(tokenB)
          ? [Pair.getAddress(tokenA, tokenB, AMMs.UNI), Pair.getAddress(tokenA, tokenB, AMMs.SUSHI)]
          : [undefined, undefined]
      }),
    [tokens]
  )

  const results = useMultipleContractSingleData(pairAddresses, PAIR_INTERFACE, 'getReserves')

  return useMemo(() => {
    return results.flatMap((result, i): [PairState, Pair | null][] => {
      const { result: reserves, loading } = result
      const tokenA = tokens[i][0]
      const tokenB = tokens[i][1]
      let pairState: PairState
      let pairs: (Pair | null)[] = [null, null]

      if (loading) {
        pairState = PairState.LOADING
      }
      if (!tokenA || !tokenB || tokenA.equals(tokenB)) {
        pairState = PairState.INVALID
      }
      if (!reserves) {
        pairState = PairState.NOT_EXISTS
      } else {
        const { reserve0, reserve1 } = reserves
        const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA]
        pairState = PairState.EXISTS
        pairs = [
          new Pair(
            new TokenAmount(token0, reserve0.toString()),
            new TokenAmount(token1, reserve1.toString()),
            AMMs.UNI
          ),
          new Pair(
            new TokenAmount(token0, reserve0.toString()),
            new TokenAmount(token1, reserve1.toString()),
            AMMs.SUSHI
          )
        ]
      }

      return [
        [pairState, pairs[0]],
        [pairState, pairs[1]]
      ]
    })
  }, [results, tokens])
}

export function usePair(tokenA?: Currency, tokenB?: Currency): [PairState, Pair | null][] {
  return usePairs([tokenA, tokenB])
}
