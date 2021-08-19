import { ApolloClient, InMemoryCache } from '@apollo/client'

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

export { bscClient, polygonClient, avalancheClient }
