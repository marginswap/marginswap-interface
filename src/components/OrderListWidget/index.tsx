import React, { useCallback, useState } from 'react'
import { Currency } from '@marginswap/sdk'
import { Button } from '@material-ui/core'
import { useActiveWeb3React } from 'hooks'
import { useLimitOrders } from 'state/order/hooks'
import { getProviderOrSigner } from 'utils'

import ConfirmOrderModal from '../OrderWidget/ConfirmOrderModal'

import {
  Container,
  ActionsHeader,
  Header,
  Row,
  Item,
  StyledDefaultButton,
  GridContainer
} from './OrderListWidget.styles'

const orders = [
  {
    id: 0,
    date: '09/01/2021',
    pair: 'ETH - DAI',
    type: 'Buy',
    amount: '$10.00',
    total: '$10.00'
  },
  {
    id: 1,
    date: '09/01/2021',
    pair: 'ETH - DAI',
    type: 'Buy',
    amount: '$10.00',
    total: '$10.00'
  },
  {
    id: 2,
    date: '09/01/2021',
    pair: 'ETH - DAI',
    type: 'Buy',
    amount: '$10.00',
    total: '$10.00'
  },
  {
    id: 3,
    date: '09/01/2021',
    pair: 'ETH - DAI',
    type: 'Buy',
    amount: '$10.00',
    total: '$10.00'
  },
  {
    id: 4,
    date: '09/01/2021',
    pair: 'ETH - DAI',
    type: 'Buy',
    amount: '$10.00',
    total: '$10.00'
  },
  {
    id: 5,
    date: '09/01/2021',
    pair: 'ETH - DAI',
    type: 'Buy',
    amount: '$10.00',
    total: '$10.00'
  },
  {
    id: 6,
    date: '09/01/2021',
    pair: 'ETH - DAI',
    type: 'Buy',
    amount: '$10.00',
    total: '$10.00'
  },
  {
    id: 7,
    date: '09/01/2021',
    pair: 'ETH - DAI',
    type: 'Buy',
    amount: '$10.00',
    total: '$10.00'
  },
  {
    id: 8,
    date: '09/01/2021',
    pair: 'ETH - DAI',
    type: 'Buy',
    amount: '$10.00',
    total: '$10.00'
  },
  {
    id: 9,
    date: '09/01/2021',
    pair: 'ETH - DAI',
    type: 'Buy',
    amount: '$10.00',
    total: '$10.00'
  }
]

const OrdersWidget = () => {
  const { library, account, chainId } = useActiveWeb3React()
  let provider: any
  if (library && account) {
    provider = getProviderOrSigner(library, account)
  }
  const { onInvalidateOrder } = useLimitOrders(provider)

  const [{ showConfirmOrder, orderErrorMessage, attemptingOrderTxn, orderTxHash }, setOrderState] = useState<{
    showConfirmOrder: boolean
    attemptingOrderTxn: boolean
    orderErrorMessage: string | undefined
    orderTxHash: string | undefined
  }>({
    showConfirmOrder: false,
    attemptingOrderTxn: false,
    orderErrorMessage: undefined,
    orderTxHash: undefined
  })

  const handleOrderInvalidation = async () => {
    if (!chainId) return

    if (!onInvalidateOrder) return

    setOrderState({
      attemptingOrderTxn: true,
      showConfirmOrder,
      orderErrorMessage: undefined,
      orderTxHash: undefined
    })

    //TODO: Still need to figure out where is the order id coming from... probably a from subgraph query?
    onInvalidateOrder('1')
      .then(hash => {
        console.log('🚀 ~ file: index.tsx ~ line 336 ~ handleOrder ~ hash', hash)
        setOrderState({
          attemptingOrderTxn: false,
          showConfirmOrder,
          orderErrorMessage: undefined,
          orderTxHash: hash
        })
      })
      .catch(error => {
        console.log('🚀 ~ file: index.tsx ~ line 109 ~ handleOrderInvalidation ~ error', error)
        setOrderState({
          attemptingOrderTxn: false,
          showConfirmOrder,
          orderErrorMessage: error.message,
          orderTxHash: undefined
        })
      })
  }

  const handleCancelOrderDismiss = useCallback(() => {
    setOrderState({ showConfirmOrder: false, attemptingOrderTxn, orderErrorMessage: undefined, orderTxHash })
  }, [attemptingOrderTxn, orderErrorMessage, orderTxHash])

  return (
    <Container>
      <ConfirmOrderModal
        isOpen={showConfirmOrder}
        attemptingTxn={attemptingOrderTxn}
        orderErrorMessage={orderErrorMessage}
        onDismiss={handleCancelOrderDismiss}
        onConfirm={handleOrderInvalidation}
        orderTxHash={orderTxHash}
        fromToken={Currency.ETHER}
        toToken={Currency.ETHER}
        inAmount={''}
        outAmount={''}
        cancelling={true}
      />
      <ActionsHeader>
        <StyledDefaultButton>Limit Orders</StyledDefaultButton>
        <Button
          color="primary"
          variant="contained"
          onClick={() => {
            setOrderState({
              attemptingOrderTxn: false,
              orderErrorMessage: undefined,
              showConfirmOrder: true,
              orderTxHash: undefined
            })
          }}
        >
          Order History
        </Button>
      </ActionsHeader>
      <GridContainer>
        <Header>
          <Item>Date</Item>
          <Item>Pair</Item>
          <Item>Type</Item>
          <Item>Amount</Item>
          <Item>Total</Item>
        </Header>
        {orders.map(order => (
          <Row key={order.id}>
            <Item>{order.date}</Item>
            <Item>{order.pair}</Item>
            <Item>{order.type}</Item>
            <Item>{order.amount}</Item>
            <Item>{order.total}</Item>
          </Row>
        ))}
      </GridContainer>
    </Container>
  )
}

export default OrdersWidget
