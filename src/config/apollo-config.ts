import { ApolloClient, InMemoryCache } from '@apollo/client'
import { ChainId } from '@marginswap/sdk'

const bscClient = new ApolloClient({
  uri: process.env.REACT_APP_GRAPH_SERVER_BSC,
  cache: new InMemoryCache()
})

const polygonClient = new ApolloClient({
  uri: process.env.REACT_APP_GRAPH_SERVER_POLYGON,
  cache: new InMemoryCache()
})

const avalancheClient = new ApolloClient({
  uri: process.env.REACT_APP_GRAPH_SERVER_AVALANCHE,
  cache: new InMemoryCache()
})

const ethereumClient = new ApolloClient({
  uri: process.env.REACT_APP_GRAPH_SERVER_ETHEREUM,
  cache: new InMemoryCache()
})

const localClient = new ApolloClient({
  uri: process.env.REACT_APP_GRAPH_SERVER_LOCAL,
  cache: new InMemoryCache()
})

const apolloClient = (chainId: ChainId | undefined) => {
  switch (chainId) {
    case ChainId.AVALANCHE:
      return avalancheClient
    case ChainId.BSC:
      return bscClient
    case ChainId.MATIC:
      return polygonClient
    case ChainId.LOCAL:
      return localClient
    default:
      return ethereumClient
  }
}

export { apolloClient }
