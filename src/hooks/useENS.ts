import { isAddress } from '../utils'
import useENSAddress from './useENSAddress'
import useENSName from './useENSName'

/**
 * Given a name or address, does a lookup to resolve to an address and name
 * @param nameOrAddress ENS name or address
 */
export default function useENS(
  nameOrAddress?: string | null
): {
  loading: boolean
  address: string | null
  name: string | null
} {
  console.log('🚀 ~ file: useENS.ts ~ line 10 ~ useENS ~ nameOrAddress', nameOrAddress)
  const validated = isAddress(nameOrAddress)
  console.log('🚀 ~ file: useENS.ts ~ line 16 ~ useENS ~ validated', validated)
  const reverseLookup = useENSName(validated ? validated : undefined)
  console.log('🚀 ~ file: useENS.ts ~ line 18 ~ useENS ~ reverseLookup', reverseLookup)
  const lookup = useENSAddress(nameOrAddress)

  return {
    loading: reverseLookup.loading || lookup.loading,
    address: validated ? validated : lookup.address,
    name: reverseLookup.ENSName ? reverseLookup.ENSName : !validated && lookup.address ? nameOrAddress || null : null
  }
}
