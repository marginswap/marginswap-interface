import ToggleButtonGroup from 'components/ToggleButtonGroup'
import Tabs from '@material-ui/core/Tabs'
import React, { useState } from 'react'
import InputAdornment from '@material-ui/core/InputAdornment'

import {
  Container,
  SettingsContainer,
  StyledMenuIcon,
  PrimaryButton,
  StyledTab,
  StyledInput
} from './OrderWidget.styles'
import TabPanel from 'components/PagerSwap/TabPanel'

const OrderWidget = () => {
  const [orderType, setOrderType] = useState(false)
  const [action, setAction] = useState(true)
  const [market, setMarket] = useState(0)

  const handleMarketChange = (event: React.ChangeEvent<unknown>, newValue: number) => {
    setMarket(newValue)
  }

  return (
    <Container>
      <ToggleButtonGroup options={['Isolated', 'Cross']} state={orderType} setState={setOrderType} big={true} />
      <ToggleButtonGroup options={['Buy', 'Sell']} state={action} setState={setAction} />

      <Tabs
        value={market}
        onChange={handleMarketChange}
        indicatorColor="primary"
        textColor="primary"
        variant="fullWidth"
      >
        <StyledTab label="Market" />
        <StyledTab label="Limit" />
      </Tabs>
      <TabPanel activeIndex={market} index={0}>
        <StyledInput
          id="amount"
          label="Amount"
          placeholder="Amount"
          variant="outlined"
          InputLabelProps={{ shrink: true }}
          InputProps={{ endAdornment: <InputAdornment position="end">ETH</InputAdornment> }}
        />
        <StyledInput
          id="price"
          label="Price"
          placeholder="Price"
          variant="outlined"
          InputLabelProps={{ shrink: true }}
          InputProps={{ endAdornment: <InputAdornment position="end">DAI</InputAdornment> }}
        />
      </TabPanel>
      <TabPanel activeIndex={market} index={1}>
        Limit components
      </TabPanel>
      <SettingsContainer>
        <span>Advanced Settings</span>
        <StyledMenuIcon />
      </SettingsContainer>
      <PrimaryButton>Place Market Order</PrimaryButton>
    </Container>
  )
}

export default OrderWidget
