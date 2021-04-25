import { CurrencyAmount, ETHER, JSBI } from '@marginswap/sdk'
import { MIN_ETH } from '../constants'

/**
 * Given some token amount, return the max that can be spent of it
 * @param currencyAmount to return max of
 * @param lendingAvailable total amount of liquidity
 */
export function maxAmountSpend(
  currencyAmount?: CurrencyAmount,
  lendingAvailable?: CurrencyAmount,
  inputMarginAccountBalance?: CurrencyAmount
): CurrencyAmount | undefined {
  if (!currencyAmount) return undefined
  if (currencyAmount.currency === ETHER) {
    if (JSBI.greaterThan(currencyAmount.raw, MIN_ETH)) {
      return CurrencyAmount.ether(JSBI.subtract(currencyAmount.raw, MIN_ETH))
    } else {
      return CurrencyAmount.ether(JSBI.BigInt(0))
    }
  }

  try {
    const maxTrade =
      lendingAvailable && inputMarginAccountBalance ? inputMarginAccountBalance.add(lendingAvailable) : currencyAmount

    if (currencyAmount.lessThan(maxTrade)) {
      return currencyAmount
    }

    return maxTrade
  } catch {
    return currencyAmount
  }
}
