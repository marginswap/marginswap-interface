import React, { useState } from 'react'
import Logo from '../../assets/images/Union.svg'
import { useActiveWeb3React } from '../../hooks'
import { useETHBalances } from '../../state/wallet/hooks'
import { CardNoise } from '../earn/styled'
import { TYPE } from '../../theme'
import Web3Network from '../Web3Network'
import Web3Status from '../Web3Status'
import ClaimModal from '../claim/ClaimModal'
import { useToggleSelfClaimModal, useShowClaimPopup } from '../../state/application/hooks'
import { useUserHasAvailableClaim } from '../../state/claim/hooks'
import { useUserHasSubmittedClaim } from '../../state/transactions/hooks'
import { Dots } from '../swap/styleds'
import Modal from '../Modal'
import UniBalanceContent from './UniBalanceContent'
import {
  AccountElement,
  BalanceText,
  HeaderControls,
  HeaderElement,
  HeaderFrame,
  HeaderLinks,
  HeaderRow,
  StyledNavLink,
  Title,
  UNIAmount,
  MobileMenuList,
  StyledBurger,
  UniIcon,
  UNIWrapper,
  StyledMenuItem,
  LogoWrapper
} from './styled'
import { Link } from 'react-router-dom'
import useClickOutside from '../../hooks/useClickOutside'

const headerLinks = [
  { path: '/swap', name: 'Swap' },
  { path: '/margin-account', name: 'Margin Account' },
  { path: '/bond-supply', name: 'Bond Lending' },
  { path: '/stake', name: 'Stake' },
  { path: '/analytics', name: 'Analytics' }
]

/*const NETWORK_LABELS: { [chainId in ChainId]?: string } = {
  [ChainId.RINKEBY]: 'Rinkeby',
  [ChainId.ROPSTEN]: 'Ropsten',
  [ChainId.GÖRLI]: 'Görli',
  [ChainId.KOVAN]: 'Kovan',
  [ChainId.MATIC]: 'Matic',
  [ChainId.XDAI]: 'xDai',
  [ChainId.HECO]: 'Heco',
  [ChainId.HARMONY]: 'Harmony',
  [ChainId.FANTOM]: 'Fantom',
  [ChainId.BSC]: 'Binance'
}*/

const MobileMenu = () => {
  const { chainId } = useActiveWeb3React()
  const [open, setOpen] = useState(false)
  const ref = useClickOutside<HTMLDivElement>(() => {
    setOpen(false)
  })

  return (
    <div ref={ref}>
      <StyledBurger open={open} onClick={() => setOpen(!open)} id="burger">
        <div />
        <div />
        <div />
      </StyledBurger>
      {open && (
        <MobileMenuList id="mob" open={open}>
          {headerLinks.map(link => {
            if (chainId !== 1 && chainId !== 31337 && link.name === 'Stake') return null
            return (
              <Link
                to={link.path}
                key={link.path}
                onClick={() => {
                  setOpen(false)
                }}
              >
                <StyledMenuItem>{link.name}</StyledMenuItem>
              </Link>
            )
          })}
        </MobileMenuList>
      )}
    </div>
  )
}

export default function Header() {
  const { account, chainId } = useActiveWeb3React()

  const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? '']
  // const [darkMode, toggleDarkMode] = useDarkModeManager()

  const toggleClaimModal = useToggleSelfClaimModal()

  const availableClaim: boolean = useUserHasAvailableClaim(account)

  const { claimTxn } = useUserHasSubmittedClaim(account ?? undefined)

  //const aggregateBalance: TokenAmount | undefined = useAggregateUniBalance()

  const [showUniBalanceModal, setShowUniBalanceModal] = useState(false)
  const showClaimPopup = useShowClaimPopup()

  //const countUpValue = aggregateBalance?.toFixed(0) ?? '0'
  //const countUpValuePrevious = usePrevious(countUpValue) ?? '0'

  return (
    <HeaderFrame id="HeaderFrame">
      <ClaimModal />
      <Modal isOpen={showUniBalanceModal} onDismiss={() => setShowUniBalanceModal(false)}>
        <UniBalanceContent setShowUniBalanceModal={setShowUniBalanceModal} />
      </Modal>
      <LogoWrapper>
        <Title href=".">
          <UniIcon>
            <img width={'33px'} src={Logo} alt="logo" />
          </UniIcon>
          <span>Marginswap</span>
        </Title>
      </LogoWrapper>
      <HeaderRow>
        <HeaderLinks id="desk">
          {headerLinks.map(link => {
            if (chainId !== 1 && chainId !== 31337 && link.name === 'Stake') return null
            return (
              <StyledNavLink key={link.path} id={`swap-nav-link`} to={link.path}>
                {link.name}
              </StyledNavLink>
            )
          })}
        </HeaderLinks>
        <MobileMenu />
      </HeaderRow>
      <HeaderControls>
        <HeaderElement style={{ marginRight: 10 }}>
          <AccountElement active={!!account} style={{ pointerEvents: 'auto' }}>
            <Web3Network />
          </AccountElement>
        </HeaderElement>
        <HeaderElement>
          {availableClaim && !showClaimPopup && (
            <UNIWrapper onClick={toggleClaimModal}>
              <UNIAmount active={!!account && !availableClaim} style={{ pointerEvents: 'auto' }}>
                <TYPE.white padding="0 2px">
                  {claimTxn && !claimTxn?.receipt ? <Dots>Claiming UNI</Dots> : 'Claim UNI'}
                </TYPE.white>
              </UNIAmount>
              <CardNoise />
            </UNIWrapper>
          )}
          {/* {!availableClaim && aggregateBalance && (
            <UNIWrapper onClick={() => setShowUniBalanceModal(true)}>
              <UNIAmount active={!!account && !availableClaim} style={{ pointerEvents: 'auto' }}>
                {account && (
                  <HideSmall>
                    <TYPE.white
                      style={{
                        paddingRight: '.4rem'
                      }}
                    >
                      <CountUp
                        key={countUpValue}
                        isCounting
                        start={parseFloat(countUpValuePrevious)}
                        end={parseFloat(countUpValue)}
                        thousandsSeparator={','}
                        duration={1}
                      />
                    </TYPE.white>
                  </HideSmall>
                )}
                MFI
              </UNIAmount>
              <CardNoise />
            </UNIWrapper>
          )} */}
          <AccountElement active={!!account} style={{ pointerEvents: 'auto' }}>
            {account && userEthBalance ? (
              <BalanceText style={{ flexShrink: 0 }} pl="0.75rem" pr="0.5rem" fontWeight={500}>
                {userEthBalance?.toSignificant(4)} {userEthBalance?.currency.getSymbol(chainId)}
              </BalanceText>
            ) : null}
            <Web3Status />
          </AccountElement>
        </HeaderElement>
        {/*<HeaderElementWrap>*/}
        {/*  <StyledMenuButton onClick={() => toggleDarkMode()}>*/}
        {/*    {darkMode ? <Moon size={20} /> : <Sun size={20} />}*/}
        {/*  </StyledMenuButton>*/}
        {/*</HeaderElementWrap>*/}
      </HeaderControls>
    </HeaderFrame>
  )
}
