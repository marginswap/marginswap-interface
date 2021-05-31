import { ChainId, Currency, currencyEquals, JSBI, Price, WETH, AMMs, ammsPerChain } from '@marginswap/sdk'
import { useMemo } from 'react'
import { getPegCurrency } from '../constants'
import { PairState, usePairs } from '../data/Reserves'
import { useActiveWeb3React } from '../hooks'
import { wrappedCurrency } from './wrappedCurrency'

/**
 * Returns the price in USDC of the input currency
 * @param currency currency to compute the USDC price of
 */
export default function usePegPrice(currency?: Currency): Price | undefined {
  const { chainId } = useActiveWeb3React()

  const pegCurrency = getPegCurrency(chainId)
  const amm1 = chainId && chainId in ammsPerChain ? (ammsPerChain as any)[chainId][0] : ammsPerChain[ChainId.MAINNET][0]
  const wrapped = wrappedCurrency(currency, chainId)
  const tokenPairs: [AMMs, Currency | undefined, Currency | undefined][] = useMemo(
    () => [
      [
        amm1,
        chainId && wrapped && currencyEquals(WETH[chainId], wrapped) ? undefined : currency,
        chainId ? WETH[chainId] : undefined
      ],
      [amm1, pegCurrency ? (wrapped?.equals(pegCurrency) ? undefined : wrapped) : undefined, pegCurrency],
      [amm1, chainId ? WETH[chainId] : undefined, pegCurrency]
    ],
    [chainId, currency, wrapped]
  )
  const [[ethPairState, ethPair], [usdcPairState, usdcPair], [usdcEthPairState, usdcEthPair]] = usePairs(tokenPairs)

  return useMemo(() => {
    if (!currency || !wrapped || !chainId) {
      return undefined
    }
    // handle weth/eth
    if (wrapped.equals(WETH[chainId])) {
      if (usdcPair && pegCurrency) {
        const price = usdcPair.priceOf(WETH[chainId])
        return new Price(currency, pegCurrency, price.denominator, price.numerator)
      } else {
        return undefined
      }
    }
    // handle usdc
    if (pegCurrency && wrapped.equals(pegCurrency)) {
      return new Price(pegCurrency, pegCurrency, '1', '1')
    }

    const ethPairETHAmount = ethPair?.reserveOf(WETH[chainId])
    const ethPairETHUSDCValue: JSBI =
      ethPairETHAmount && usdcEthPair ? usdcEthPair.priceOf(WETH[chainId]).quote(ethPairETHAmount).raw : JSBI.BigInt(0)

    // all other tokens
    // first try the usdc pair
    if (
      usdcPairState === PairState.EXISTS &&
      usdcPair &&
      pegCurrency &&
      usdcPair.reserveOf(pegCurrency).greaterThan(ethPairETHUSDCValue)
    ) {
      const price = usdcPair.priceOf(wrapped)
      return new Price(currency, pegCurrency, price.denominator, price.numerator)
    }
    if (ethPairState === PairState.EXISTS && ethPair && usdcEthPairState === PairState.EXISTS && usdcEthPair) {
      if (
        pegCurrency &&
        usdcEthPair.reserveOf(pegCurrency).greaterThan('0') &&
        ethPair.reserveOf(WETH[chainId]).greaterThan('0')
      ) {
        const ethUsdcPrice = usdcEthPair.priceOf(pegCurrency)
        const currencyEthPrice = ethPair.priceOf(WETH[chainId])
        const usdcPrice = ethUsdcPrice.multiply(currencyEthPrice).invert()
        return new Price(currency, pegCurrency, usdcPrice.denominator, usdcPrice.numerator)
      }
    }
    return undefined
  }, [chainId, currency, ethPair, ethPairState, usdcEthPair, usdcEthPairState, usdcPair, usdcPairState, wrapped])
}
