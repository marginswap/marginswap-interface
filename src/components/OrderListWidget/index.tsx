import React, { useCallback, useEffect, useState } from 'react'
import { useActiveWeb3React } from 'hooks'
import { useLimitOrders, useOrderState } from 'state/order/hooks'
import { getProviderOrSigner } from 'utils'
import {
  Container,
  ActionsHeader,
  Header,
  Row,
  Item,
  GridContainer,
  Badge,
  CancelButton
} from './OrderListWidget.styles'
import { ToggleOption, ToggleWrapper } from 'components/ToggleButtonGroup/ToggleButtonGroup.styles'
import ConfirmCancelOrderModal from './ConfirmCancelOrderModal'
import { OrderInfo } from 'types'
import FormattedDate from './FormattedDate'
import FormattedPair from './FormattedPair'
import FormattedAmount from './FormattedAmount'
import FormattedPrice from './FormattedPrice'
import { useLimitOrdersHistoryQuery, useLimitOrdersQuery } from 'graphql/queries/orderHistory'
import { apolloClient } from 'config/apollo-config'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'state'
import { setLimitOrders, setOrderHistory } from 'state/order/actions'
import Loader from 'components/Loader'

enum OrderView {
  LIMIT,
  HISTORY
}

const DATA_POLLING_INTERVAL = 10 * 1000

const OrdersWidget = () => {
  const dispatch = useDispatch<AppDispatch>()
  const [orderView, setOrderView] = useState(OrderView.LIMIT)
  const { library, account, chainId } = useActiveWeb3React()
  const { limitOrders, orderHistory } = useOrderState()
  const [orders, setOrders] = useState<OrderInfo[]>([])
  const [pollingInterval, setPollingInterval] = useState<ReturnType<typeof setInterval> | null>()
  const [triggerDataPoll, setTriggerDataPoll] = useState<boolean>(true)

  let provider: any
  if (library && account) {
    provider = getProviderOrSigner(library, account)
  }
  const { onInvalidateOrder } = useLimitOrders(provider)

  const [{ order, showConfirmOrder, orderErrorMessage, attemptingOrderTxn, orderTxHash }, setOrderState] = useState<{
    order: OrderInfo
    showConfirmOrder: boolean
    attemptingOrderTxn: boolean
    orderErrorMessage: string | undefined
    orderTxHash: string | undefined
  }>({
    order: {} as OrderInfo,
    showConfirmOrder: false,
    attemptingOrderTxn: false,
    orderErrorMessage: undefined,
    orderTxHash: undefined
  })

  const {
    data: limitOrderData,
    loading: loadingOrders,
    refetch: reloadOrders
  } = useLimitOrdersQuery({
    variables: {
      maker: account
    },
    client: apolloClient(chainId)
  })

  const {
    data: orderHistoryData,
    loading: loadingHistory,
    refetch: reloadOrderHistory
  } = useLimitOrdersHistoryQuery({
    variables: {
      maker: account
    },
    client: apolloClient(chainId)
  })

  // these next two useEffect hooks handle order data polling
  useEffect(() => {
    if (triggerDataPoll) {
      try {
        setTriggerDataPoll(false)
        reloadOrders()
        reloadOrderHistory()
      } catch (e) {
        console.error(e)
      }
    }
  }, [triggerDataPoll, library])

  useEffect(() => {
    const interval = setInterval(() => setTriggerDataPoll(true), DATA_POLLING_INTERVAL)
    setPollingInterval(interval)

    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval)
      }
    }
  }, [])

  useEffect(() => {
    if (limitOrderData && limitOrderData.orders) {
      dispatch(setLimitOrders({ orders: limitOrderData }))
    }
  }, [limitOrderData])

  useEffect(() => {
    if (orderHistoryData && orderHistoryData.orders) {
      dispatch(setOrderHistory({ orders: orderHistoryData }))
    }
  }, [orderHistoryData])

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

    //TODO: Still need to figure out where is the order id coming from... probably a from subgraph query?
    onInvalidateOrder(order?.id.toString())
      .then(hash => {
        setOrderState({
          order: {} as OrderInfo,
          attemptingOrderTxn: false,
          showConfirmOrder,
          orderErrorMessage: undefined,
          orderTxHash: hash
        })
      })
      .catch(error => {
        setOrderState({
          order: {} as OrderInfo,
          attemptingOrderTxn: false,
          showConfirmOrder,
          orderErrorMessage: error.message,
          orderTxHash: undefined
        })
      })
  }

  const handleCancelOrderDismiss = useCallback(() => {
    setOrderState({
      order: {} as OrderInfo,
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
    if (orderView === OrderView.LIMIT) {
      setOrders(limitOrders ? limitOrders.orders : [])
    } else {
      setOrders(orderHistory ? orderHistory.orders : [])
    }
  }

  useEffect(() => {
    setOrderData()
  }, [orderView, limitOrders, orderHistory])

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
            style={{ height: '28px', borderRadius: '6px' }}
          >
            Limit Orders
          </ToggleOption>
          <ToggleOption
            onClick={() => handleOrderViewChange(OrderView.HISTORY)}
            active={orderView === OrderView.HISTORY}
            style={{ height: '28px', borderRadius: '6px' }}
          >
            Order History
          </ToggleOption>
        </ToggleWrapper>
      </ActionsHeader>
      <GridContainer>
        <Header>
          <Item>Date</Item>
          <Item>Pair</Item>
          <Item>Amount</Item>
          <Item>Price</Item>
          <Item>{orderView === OrderView.LIMIT ? 'Actions' : 'Status'}</Item>
        </Header>
        <div style={{ height: '310px', overflowX: 'auto' }}>
          {loadingOrders || loadingHistory ? <Loader /> : null}
          {orders.map((order: OrderInfo) => (
            <Row key={order.id}>
              <Item>
                <FormattedDate order={order} />
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
          ))}
        </div>
      </GridContainer>
    </Container>
  )
}

export default OrdersWidget
