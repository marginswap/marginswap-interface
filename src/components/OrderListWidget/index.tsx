import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useActiveWeb3React } from 'hooks'
import { useLimitOrders, useOrderState } from 'state/order/hooks'
import { getProviderOrSigner } from 'utils'
import { DateTime } from 'luxon'
import {
  Container,
  ActionsHeader,
  Header,
  Row,
  Item,
  GridContainer,
  Badge,
  CancelButton,
  Span
} from './OrderListWidget.styles'
import { ToggleOption, ToggleWrapper } from 'components/ToggleButtonGroup/ToggleButtonGroup.styles'
import { LimitOrder, OrderInfo } from 'types'
import { useLimitOrdersHistoryQuery } from 'graphql/queries/orderHistory'
import { apolloClient } from 'config/apollo-config'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'state'
import { setOrderHistory } from 'state/order/actions'
import ConfirmCancelOrderModal from './ConfirmCancelOrderModal'
import FormattedPair from './FormattedPair'
import FormattedAmount from './FormattedAmount'
import FormattedPrice from './FormattedPrice'
import { ProUIContext } from 'pages/Pro'
import { useIsTransactionPending } from '../../state/transactions/hooks'
import { OrderRecord } from '@marginswap/sdk'

enum OrderView {
  LIMIT,
  HISTORY
}

const DATA_POLLING_INTERVAL = 10 * 1000

const OrderListWidget = () => {
  const { pendingOrderTx, setPendingOrderTx } = useContext(ProUIContext)
  const dispatch = useDispatch<AppDispatch>()
  const [orderView, setOrderView] = useState(OrderView.LIMIT)
  const { library, account, chainId } = useActiveWeb3React()
  const { orderHistory } = useOrderState()
  const [orders, setOrders] = useState<OrderInfo[]>([])
  const [limitOrders, setLimitOrders] = useState<LimitOrder[]>([])
  const [pollingInterval, setPollingInterval] = useState<ReturnType<typeof setInterval> | null>()
  const [triggerDataPoll, setTriggerDataPoll] = useState<boolean>(true)

  let provider: any
  if (library && account) {
    provider = getProviderOrSigner(library, account)
  }
  const { onInvalidateOrder, onGetLimitOrders } = useLimitOrders(provider)

  const [{ order, showConfirmOrder, orderErrorMessage, attemptingOrderTxn, orderTxHash }, setOrderState] = useState<{
    order: LimitOrder
    showConfirmOrder: boolean
    attemptingOrderTxn: boolean
    orderErrorMessage: string | undefined
    orderTxHash: string | undefined
  }>({
    order: {} as LimitOrder,
    showConfirmOrder: false,
    attemptingOrderTxn: false,
    orderErrorMessage: undefined,
    orderTxHash: undefined
  })

  const { data: orderHistoryData, refetch: reloadOrderHistory } = useLimitOrdersHistoryQuery({
    variables: {
      maker: account
    },
    client: apolloClient(chainId)
  })

  const isTxnPending = useIsTransactionPending(pendingOrderTx || '')

  useEffect(() => {
    if (!isTxnPending && pendingOrderTx) {
      setPendingOrderTx('')
      loadAccountOrders()
    }
  }, [isTxnPending])

  const loadAccountOrders = () => {
    if (!account) return

    if (!onGetLimitOrders) return

    onGetLimitOrders(account)
      .then((result: Record<number, Record<number, OrderRecord>>) => {
        console.log('🚀 ~ file: index.tsx ~ line 93 ~ .then ~ result', result)
        const orders: LimitOrder[] = []

        Object.entries(result).forEach(([, v]) => {
          const orderId = v[0] as any
          const orderRecord: OrderRecord = v[1]

          const limitOrder: LimitOrder = {
            id: orderId,
            fromToken: orderRecord.fromToken,
            toToken: orderRecord.toToken,
            inAmount: orderRecord.inAmount,
            outAmount: orderRecord.outAmount,
            expiration: orderRecord.expiration,
            maker: orderRecord.maker
          }

          orders.push(limitOrder)
        })

        orders.sort((a, b) => (a.id < b.id ? 1 : -1))
        setLimitOrders(orders)
      })
      .catch(error => {
        console.log('🚀 ~ file: index.tsx ~ line 117 ~ loadAccountOrders ~ error', error)
      })
  }

  useEffect(() => {
    if (orderHistoryData && orderHistoryData.orders) {
      dispatch(setOrderHistory({ orders: orderHistoryData }))
    }
  }, [orderHistoryData])

  // these next two useEffect hooks handle order data polling
  useEffect(() => {
    if (triggerDataPoll) {
      try {
        setTriggerDataPoll(false)
        reloadOrderHistory()
      } catch (e) {
        console.error(e)
      }
    }
  }, [triggerDataPoll, library])

  useEffect(() => {
    const interval = setInterval(() => setTriggerDataPoll(true), DATA_POLLING_INTERVAL)
    setPollingInterval(interval)
    setLimitOrders([])

    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval)
      }
    }
  }, [])

  useEffect(() => {
    loadAccountOrders()
  }, [account, chainId])

  const handleCancelOrder = async () => {
    if (!chainId) return

    if (!onInvalidateOrder) return

    if (!order) return

    setOrderState({
      order: order,
      attemptingOrderTxn: true,
      showConfirmOrder,
      orderErrorMessage: undefined,
      orderTxHash: undefined
    })

    onInvalidateOrder(order?.id.toString())
      .then(hash => {
        setOrderState({
          order: {} as LimitOrder,
          attemptingOrderTxn: false,
          showConfirmOrder,
          orderErrorMessage: undefined,
          orderTxHash: hash
        })

        setPendingOrderTx(hash)
      })
      .catch(error => {
        setOrderState({
          order: {} as LimitOrder,
          attemptingOrderTxn: false,
          showConfirmOrder,
          orderErrorMessage: error.message,
          orderTxHash: undefined
        })
      })
  }

  const handleCancelOrderDismiss = useCallback(() => {
    setOrderState({
      order: {} as LimitOrder,
      showConfirmOrder: false,
      attemptingOrderTxn,
      orderErrorMessage: undefined,
      orderTxHash
    })
  }, [attemptingOrderTxn, orderErrorMessage, orderTxHash])

  const handleOrderViewChange = (orderView: OrderView) => {
    setOrderView(orderView)
  }

  const setOrderData = () => {
    if (orderView === OrderView.HISTORY) {
      setOrders(orderHistory ? orderHistory.orders : [])
    }
  }

  useEffect(() => {
    setOrderData()
  }, [orderView, limitOrders, orderHistory])

  const dateItem = (timestamp: string) => {
    return <span>{DateTime.fromMillis(+timestamp * 1000).toLocaleString(DateTime.DATE_SHORT)}</span>
  }

  return (
    <Container>
      {order.id && (
        <ConfirmCancelOrderModal
          isOpen={showConfirmOrder}
          attemptingTxn={attemptingOrderTxn}
          orderErrorMessage={orderErrorMessage}
          onDismiss={handleCancelOrderDismiss}
          onConfirm={handleCancelOrder}
          orderTxHash={orderTxHash}
          order={order}
        />
      )}

      <ActionsHeader>
        <ToggleWrapper
          style={{
            backgroundColor: '#161618',
            padding: '0',
            borderRadius: '8px',
            width: '28%',
            marginTop: '6px',
            marginLeft: '4px'
          }}
        >
          <ToggleOption
            onClick={() => handleOrderViewChange(OrderView.LIMIT)}
            active={orderView === OrderView.LIMIT}
            style={{ height: '28px', borderRadius: '6px', minWidth: '7rem' }}
          >
            Limit Orders
          </ToggleOption>
          <ToggleOption
            onClick={() => handleOrderViewChange(OrderView.HISTORY)}
            active={orderView === OrderView.HISTORY}
            style={{ height: '28px', borderRadius: '6px', minWidth: '7rem' }}
          >
            Order History
          </ToggleOption>
        </ToggleWrapper>
      </ActionsHeader>
      <GridContainer>
        <Header>
          {orderView === OrderView.HISTORY ? <Item>Date</Item> : <Item>Id</Item>}
          <Item>Pair</Item>
          <Item>Amount</Item>
          <Item>Price</Item>
          <Item>{orderView === OrderView.LIMIT ? 'Actions' : 'Status'}</Item>
        </Header>
        <div style={{ height: '325px', overflowX: 'auto' }}>
          {orderView === OrderView.LIMIT && limitOrders.length === 0 && (
            <div style={{ position: 'relative', top: '50%', transform: 'translateY(-50%)', textAlign: 'center' }}>
              No Limit Orders yet...
            </div>
          )}
          {orderView === OrderView.HISTORY && orders.length === 0 && (
            <div style={{ position: 'relative', top: '50%', transform: 'translateY(-50%)', textAlign: 'center' }}>
              No Order History yet...
            </div>
          )}
          {orderView === OrderView.LIMIT
            ? limitOrders.map((order: LimitOrder) => (
                <Row key={order.id}>
                  <Item>
                    <Span>{order.id}</Span>
                  </Item>
                  <Item>
                    <FormattedPair order={order} />
                  </Item>
                  <Item>
                    <FormattedAmount order={order} />
                  </Item>
                  <Item>
                    <FormattedPrice order={order} />
                  </Item>
                  <Item>
                    {orderView === OrderView.LIMIT ? (
                      <CancelButton
                        onClick={() => {
                          setOrderState({
                            order: order,
                            attemptingOrderTxn: false,
                            orderErrorMessage: undefined,
                            showConfirmOrder: true,
                            orderTxHash: undefined
                          })
                        }}
                      >
                        Cancel
                      </CancelButton>
                    ) : (
                      <Badge>Cancelled</Badge>
                    )}
                  </Item>
                </Row>
              ))
            : orders.map((order: OrderInfo) => (
                <Row key={order.id}>
                  <Item>
                    <Span>{dateItem(order.createdAt)}</Span>
                  </Item>
                  <Item>
                    <FormattedPair order={order} />
                  </Item>
                  <Item>
                    <FormattedAmount order={order} />
                  </Item>
                  <Item>
                    <FormattedPrice order={order} />
                  </Item>
                  <Item>
                    <Badge>Cancelled</Badge>
                  </Item>
                </Row>
              ))}
        </div>
      </GridContainer>
    </Container>
  )
}

export default OrderListWidget
