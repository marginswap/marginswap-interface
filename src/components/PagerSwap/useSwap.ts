import { ChangeEvent, useState } from 'react'
import { TokenInfo } from '@uniswap/token-lists'

const useSwap = ({
  tokens,
  accountConnected,
  exchangeRates
}: {
  tokens: (TokenInfo & { balance?: number; borrowable?: number })[]
  accountConnected: boolean
  exchangeRates: Record<string, number>
}) => {
  const [error, setError] = useState<string | null>(null)
  const [currentTab, setCurrentTab] = useState(0)

  const [spotQuantityFrom, setSpotQuantityFrom] = useState('0')
  const [spotCurrencyFrom, setSpotCurrencyFrom] = useState<number | null>(null)
  const [spotQuantityTo, setSpotQuantityTo] = useState('0')
  const [spotCurrencyTo, setSpotCurrencyTo] = useState<number | null>(null)

  const [marginQuantityFrom, setMarginQuantityFrom] = useState('0')
  const [marginCurrencyFrom, setMarginCurrencyFrom] = useState<number | null>(null)
  const [marginQuantityTo, setMarginQuantityTo] = useState('0')
  const [marginCurrencyTo, setMarginCurrencyTo] = useState<number | null>(null)

  const [settingsOpened, setSettingsOpened] = useState(false)
  const [expertMode, setExpertMode] = useState(false)
  const [slippageTolerance, setSlippageTolerance] = useState(50)
  const [transactionDeadline, setTransactionDeadline] = useState(1200)
  const [singleHopOnly, setSingleHopOnly] = useState(false)

  const toggleExpertMode = () => {
    setExpertMode(prevState => !prevState)
  }

  const toggleSettings = () => {
    setSettingsOpened(prevState => !prevState)
  }

  const handleChangeTab = (event: ChangeEvent<unknown>, newValue: number) => {
    setCurrentTab(newValue)
  }

  const replaceCurrencies = () => {
    if (currentTab === 0) {
      const prevCurrencyFrom = spotCurrencyFrom
      setSpotCurrencyFrom(spotCurrencyTo)
      setSpotCurrencyTo(prevCurrencyFrom)
      const prevQuantityFrom = spotQuantityFrom
      setSpotQuantityFrom(spotQuantityTo)
      setSpotQuantityTo(prevQuantityFrom)
    } else {
      const prevCurrencyFrom = marginCurrencyFrom
      setMarginCurrencyFrom(marginCurrencyTo)
      setMarginCurrencyTo(prevCurrencyFrom)
      const prevQuantityFrom = marginQuantityFrom
      setMarginQuantityFrom(marginQuantityTo)
      setMarginQuantityTo(prevQuantityFrom)
    }
  }

  const getExchangeRate = (from: string, to: string) => {
    if (exchangeRates[`${from}_${to}`]) {
      return exchangeRates[`${from}_${to}`]
    } else if (exchangeRates[`${to}_${from}`]) {
      return 1 / exchangeRates[`${to}_${from}`]
    } else {
      setError(`Cannot get exchange rate for ${to} and ${from}`)
      return 1
    }
  }

  const handleAmountChange = (amount: string, from: boolean, spot: boolean) => {
    if (spot) {
      if (from) {
        setSpotQuantityFrom(amount)
        if (spotCurrencyFrom !== null && spotCurrencyTo !== null) {
          setSpotQuantityTo(
            String(
              Math.round(
                getExchangeRate(tokens[spotCurrencyFrom].symbol, tokens[spotCurrencyTo].symbol) *
                  Number(amount) *
                  1000000
              ) / 1000000
            )
          )
        }
      } else {
        setSpotQuantityTo(amount)
        if (spotCurrencyFrom !== null && spotCurrencyTo !== null) {
          setSpotQuantityFrom(
            String(
              Math.round(
                getExchangeRate(tokens[spotCurrencyTo].symbol, tokens[spotCurrencyFrom].symbol) *
                  Number(amount) *
                  1000000
              ) / 1000000
            )
          )
        }
      }
    } else {
      if (from) {
        setMarginQuantityFrom(amount)
        if (marginCurrencyFrom !== null && marginCurrencyTo !== null) {
          setMarginQuantityTo(
            String(
              Math.round(
                getExchangeRate(tokens[marginCurrencyFrom].symbol, tokens[marginCurrencyTo].symbol) *
                  Number(amount) *
                  1000000
              ) / 1000000
            )
          )
        }
      } else {
        setMarginQuantityTo(amount)
        if (marginCurrencyFrom !== null && marginCurrencyTo !== null) {
          setMarginQuantityFrom(
            String(
              Math.round(
                getExchangeRate(tokens[marginCurrencyTo].symbol, tokens[marginCurrencyFrom].symbol) *
                  Number(amount) *
                  1000000
              ) / 1000000
            )
          )
        }
      }
    }
  }

  const handleSelectToken = (tokenIndex: number, from: boolean, spot: boolean) => {
    if (spot) {
      if (from) {
        setSpotCurrencyFrom(tokenIndex)
        if (spotCurrencyTo !== null) {
          setSpotQuantityTo(
            String(
              Math.round(
                getExchangeRate(tokens[tokenIndex].symbol, tokens[spotCurrencyTo].symbol) *
                  Number(spotQuantityFrom) *
                  1000000
              ) / 1000000
            )
          )
        }
      } else {
        setSpotCurrencyTo(tokenIndex)
        if (spotCurrencyFrom !== null) {
          setSpotQuantityTo(
            String(
              Math.round(
                getExchangeRate(tokens[spotCurrencyFrom].symbol, tokens[tokenIndex].symbol) *
                  Number(spotQuantityFrom) *
                  1000000
              ) / 1000000
            )
          )
        }
      }
    } else {
      if (from) {
        setMarginCurrencyFrom(tokenIndex)
        if (marginCurrencyTo !== null) {
          setMarginQuantityTo(
            String(
              Math.round(
                getExchangeRate(tokens[tokenIndex].symbol, tokens[marginCurrencyTo].symbol) *
                  Number(marginQuantityFrom) *
                  1000000
              ) / 1000000
            )
          )
        }
      } else {
        setMarginCurrencyTo(tokenIndex)
        if (marginCurrencyFrom !== null) {
          setMarginQuantityTo(
            String(
              Math.round(
                getExchangeRate(tokens[marginCurrencyFrom].symbol, tokens[tokenIndex].symbol) *
                  Number(marginQuantityFrom) *
                  1000000
              ) / 1000000
            )
          )
        }
      }
    }
  }

  const getButtonDisabledStatus = () => {
    if (currentTab === 0) {
      if (!Number(spotQuantityFrom)) return 'Enter amount'
      if (spotCurrencyFrom === null || spotCurrencyTo === null) return 'Select token'
      if (!accountConnected || !tokens[spotCurrencyFrom].balance) return 'Connect an account'
      if (tokens[spotCurrencyFrom].balance! < Number(spotQuantityFrom))
        return `Insufficient ${tokens[spotCurrencyFrom].symbol} balance`
    } else {
      if (!Number(marginQuantityFrom)) return 'Enter amount'
      if (marginCurrencyFrom === null || marginCurrencyTo === null) return 'Select token'
      if (!accountConnected || !tokens[marginCurrencyFrom].balance) return 'Connect an account'
      if (tokens[marginCurrencyFrom].balance! < Number(marginQuantityFrom))
        return `Insufficient ${tokens[marginCurrencyFrom].symbol} balance`
    }
    return null
  }

  return {
    error,
    currentTab,
    handleChangeTab,
    getExchangeRate,
    spotQuantityFrom,
    spotQuantityTo,
    spotCurrencyFrom,
    spotCurrencyTo,
    marginQuantityFrom,
    marginQuantityTo,
    marginCurrencyFrom,
    marginCurrencyTo,
    replaceCurrencies,
    getButtonDisabledStatus,
    handleAmountChange,
    handleSelectToken,
    settingsOpened,
    toggleSettings,
    expertMode,
    toggleExpertMode,
    slippageTolerance,
    setSlippageTolerance,
    transactionDeadline,
    setTransactionDeadline,
    singleHopOnly,
    setSingleHopOnly
  }
}

export default useSwap
