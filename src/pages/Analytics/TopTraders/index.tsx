import React, { useState, useMemo, useCallback, useEffect } from 'react'
import Collapse from '@material-ui/core/Collapse'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import IconButton from '@material-ui/core/IconButton'
import { Container, Content, Title, TableHead, WalletsList, Cell, WalletListItemText, WalletListItem } from './styled'
import { Trader } from '../types'
import { getTopTraders } from '../utils'
import { useSwapsQuery } from 'graphql/queries/analytics'
import { apolloClient } from '../../../config/apollo-config'
import moment from 'moment'
import { ChainId } from '@marginswap/sdk'

type Order = '+' | '-'

type OrderKey = 'dailyVolume' | 'weeklyVolume' | 'monthlyVolume'

const gteValue = moment.utc().startOf('day').subtract(30, 'days').unix()
const lteValue = moment.utc().unix()

const TopTraders: React.FC = () => {
  const numberFormat = new Intl.NumberFormat()
  const [order, setOrder] = useState<Order>('+')
  const [orderKey, setOrderKey] = useState<OrderKey>('monthlyVolume')
  const [checked, setChecked] = useState(true)
  const [topTraders, setTopTraders] = useState<Trader[]>([])
  const dummyData = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}]

  const { data: avaSwapsData, loading: avaSwapsLoading } = useSwapsQuery({
    client: apolloClient(ChainId.AVALANCHE),
    variables: {
      gte: gteValue,
      lte: lteValue
    }
  })

  const { data: polySwapsData, loading: polySwapsLoading } = useSwapsQuery({
    client: apolloClient(ChainId.MATIC),
    variables: {
      gte: gteValue,
      lte: lteValue
    }
  })

  const { data: bscSwapsData, loading: bscSwapsLoading } = useSwapsQuery({
    client: apolloClient(ChainId.BSC),
    variables: {
      gte: gteValue,
      lte: lteValue
    }
  })

  const { data: ethSwapsData, loading: ethSwapsLoading } = useSwapsQuery({
    client: apolloClient(ChainId.MAINNET),
    variables: {
      gte: gteValue,
      lte: lteValue
    }
  })

  const loading = useMemo(
    () => avaSwapsLoading || polySwapsLoading || bscSwapsLoading || ethSwapsLoading,
    [avaSwapsLoading, bscSwapsLoading, ethSwapsLoading, polySwapsLoading]
  )

  const swaps = useMemo(() => {
    if (loading) {
      return {
        bscData: [],
        polygonData: [],
        avalancheData: [],
        ethData: []
      }
    }

    return {
      bscData: bscSwapsData?.swaps || [],
      polygonData: polySwapsData?.swaps || [],
      avalancheData: avaSwapsData?.swaps || [],
      ethData: ethSwapsData?.swaps || []
    }
  }, [loading]) // eslint-disable-line react-hooks/exhaustive-deps

  const sortTraders = useMemo(() => {
    if (!order || !orderKey) return topTraders

    return topTraders.sort((a, b) => {
      if (order === '+') {
        return b[orderKey] - a[orderKey]
      } else {
        return a[orderKey] - b[orderKey]
      }
    })
  }, [order, orderKey, topTraders])

  const arrowPositon = useCallback(
    (key: OrderKey | null) => {
      if (key !== orderKey) return <span style={{ opacity: 0.2, fontSize: '20px' }}>⇗</span>

      return <span style={{ fontSize: '20px' }}>{order === '+' ? '⇗' : '⇘'}</span>
    },
    [order, orderKey]
  )

  const changeOrder = useCallback(
    (key: OrderKey | null) => {
      if (!key) return

      const prevOrderKey = orderKey

      if (prevOrderKey === key) {
        setOrder(order === '+' ? '-' : '+')
      } else {
        setOrder('+')
      }

      setOrderKey(key)
    },
    [orderKey, setOrderKey, setOrder, order]
  )

  const tableHeaders: { title: string; key: OrderKey | null }[] = useMemo(
    () => [
      { title: 'Wallet', key: null },
      { title: 'Volume (24hrs)', key: 'dailyVolume' },
      { title: 'Weekly', key: 'weeklyVolume' },
      { title: 'Monthly', key: 'monthlyVolume' }
    ],
    []
  )

  useEffect(() => {
    const { avalancheData, bscData, ethData, polygonData } = swaps

    if (!avalancheData.length && !bscData.length && !ethData.length && !polygonData.length) return

    fetchTopTraders()
  }, [swaps]) // eslint-disable-line react-hooks/exhaustive-deps

  const fetchTopTraders = useCallback(async () => {
    const traders = await getTopTraders(swaps)

    setTopTraders(traders)
  }, [swaps])

  return (
    <Container>
      <Content>
        <Title>Top Traders</Title>
        <TableHead>
          {tableHeaders.map(({ title, key }, index) => (
            <Cell key={index} onClick={() => key && changeOrder(key)}>
              {title}
              {key && arrowPositon(key)}
            </Cell>
          ))}
        </TableHead>

        <Collapse in={checked}>
          <WalletsList>
            {loading || !sortTraders.length ? (
              <>
                {dummyData.map((_, index) => (
                  <WalletListItem key={index}>
                    <div className="no-data"></div>
                  </WalletListItem>
                ))}
              </>
            ) : (
              <>
                {sortTraders.map(({ address, dailyVolume, weeklyVolume, monthlyVolume }: Trader) => (
                  <WalletListItem key={address}>
                    <WalletListItemText monospaced>{address}</WalletListItemText>
                    <WalletListItemText>${numberFormat.format(dailyVolume)}</WalletListItemText>
                    <WalletListItemText>${numberFormat.format(weeklyVolume)}</WalletListItemText>
                    <WalletListItemText>${numberFormat.format(monthlyVolume)}</WalletListItemText>
                  </WalletListItem>
                ))}
              </>
            )}
          </WalletsList>
        </Collapse>

        <IconButton className="expand" onClick={() => setChecked(prevState => !prevState)}>
          {checked ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Content>
    </Container>
  )
}

export default TopTraders
