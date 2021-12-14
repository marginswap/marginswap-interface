import axiosInstance from '../config/axios-config'
import { COINGECKO_PLATFORM_ID } from '../constants'
import { ChainId } from '@marginswap/sdk'

export async function getTokenUSDPrice(
  chainId: ChainId,
  tokenAddress: string,
  include24hrChange: boolean
): Promise<string[] | void> {
  const coingeckoUrl = `/simple/token_price/${COINGECKO_PLATFORM_ID[chainId]}`
  let result

  try {
    const { data } = await axiosInstance.get(coingeckoUrl, {
      params: {
        contract_addresses: tokenAddress,
        vs_currencies: 'usd',
        include_24hr_change: include24hrChange
      }
    })

    result = [data[tokenAddress.toLowerCase()]?.usd, data[tokenAddress.toLowerCase()]?.usd_24h_change]
  } catch (err) {
    result = [0, 0]
  }

  return result
}
