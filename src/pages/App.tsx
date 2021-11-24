import { GasFees } from 'components/GasFees'
import React, { Suspense } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import styled from 'styled-components'
import GoogleAnalyticsReporter from '../components/analytics/GoogleAnalyticsReporter'
import Header from '../components/Header'
import Polling from '../components/Header/Polling'
import URLWarning from '../components/Header/URLWarning'
import Popups from '../components/Popups'
import Web3ReactManager from '../components/Web3ReactManager'
import { MarginAccount } from './MarginAccount'
import Swap from './Swap'
import Vote from './Vote'
import VotePage from './Vote/VotePage'
import BondSupply from './BondSupply'
import Analytics from './Analytics'
import Stake from './Stake'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const AppWrapper = styled.div`
  display: flex;
  flex-flow: column;
  align-items: flex-start;
  overflow-x: hidden;
`

const HeaderWrapper = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  width: 100%;
  justify-content: space-between;
`

const BodyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-top: 20px;
  align-items: center;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 16px;
  `};

  z-index: 1;
`

const Marginer = styled.div`
  margin-top: 5rem;
`

export default function App() {
  return (
    <Suspense fallback={null}>
      <Route component={GoogleAnalyticsReporter} />
      <AppWrapper>
        <URLWarning />
        <HeaderWrapper>
          <Header />
        </HeaderWrapper>
        <BodyWrapper>
          <Popups />
          <Polling />
          <Web3ReactManager>
            <Switch>
              <Route exact strict path="/swap" component={Swap} />
              <Route exact strict path="/stake" component={Stake} />
              <Route exact strict path="/margin-account" component={MarginAccount} />
              <Route exact strict path="/bond-supply" component={BondSupply} />
              <Route exact strict path="/analytics" component={Analytics} />
              <Route exact strict path="/gas-fees" component={GasFees} />
              <Route exact strict path="/vote" component={Vote} />
              <Route exact strict path="/vote/:id" component={VotePage} />
              <Route component={() => <Redirect to={{ pathname: '/swap' }} />} />
            </Switch>
          </Web3ReactManager>
          <Marginer />
          <ToastContainer />
        </BodyWrapper>
      </AppWrapper>
    </Suspense>
  )
}
