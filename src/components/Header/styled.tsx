import styled from 'styled-components'
import Row, { RowFixed } from '../Row'
import { YellowCard } from '../Card'
import { Text } from 'rebass'
import { NavLink } from 'react-router-dom'
import { darken } from 'polished'

export const HeaderFrame = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  width: 100%;
  top: 0;
  position: relative;
  background: initial;
  padding: 1rem;
  z-index: 2;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    grid-template-columns: 1fr;
    padding: 0 1rem;
    width: calc(100%);
    position: relative;
    margin-top: 16px;
  `};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
      padding: 0.5rem 1rem;
  `}
`

export const HeaderControls = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-self: flex-end;
  min-width: 262px;
  justify-content: flex-end;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    flex-direction: row;
    justify-content: space-between;
    justify-self: center;
    width: 100%;
    max-width: 960px;
    padding: 2rem;
    position: fixed;
    bottom: 0px;
    left: 0px;
    width: 100%;
    z-index: 99;
    height: 72px;
    border-radius: 12px 12px 0 0;
    background-color: ${({ theme }) => theme.bg1};
  `};
`

export const HeaderElement = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  ${({ theme }) => theme.mediaWidth.upToMedium`
   flex-direction: row-reverse;
    align-items: center;
  `};
`

export const HeaderElementWrap = styled.div`
  display: flex;
  align-items: center;
`

export const HeaderRow = styled(RowFixed)`
  ${({ theme }) => theme.mediaWidth.upToMedium`
   width: 100%;
   position: relative;
  `};
`

export const HeaderLinks = styled(Row)`
  justify-content: center;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    display: none;
    padding: 1rem 0 1rem 1rem;
    justify-content: flex-end;
`};
`

export const AccountElement = styled.div<{ active: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  background: #4255ff;
  border-radius: 19px;
  white-space: nowrap;
  width: 100%;
  color: #e0e0e0;
  cursor: pointer;

  :focus {
    border: 1px solid blue;
  }
`

export const UNIAmount = styled(AccountElement)`
  color: white;
  padding: 4px 16px;
  width: 87px;
  height: 37px;
  font-weight: 500;
  background: #9906fe;
  border-radius: 19px;
  justify-content: center;
`

export const UNIWrapper = styled.span`
  width: fit-content;
  position: relative;
  cursor: pointer;

  :hover {
    opacity: 0.8;
  }

  :active {
    opacity: 0.9;
  }
`

export const HideSmall = styled.span`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: none;
  `};
`

export const NetworkCard = styled(YellowCard)`
  border-radius: 12px;
  padding: 8px 12px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin: 0;
    margin-right: 0.5rem;
    width: initial;
    overflow: hidden;
    text-overflow: ellipsis;
    flex-shrink: 1;
  `};
`

export const BalanceText = styled(Text)`
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display: none;
  `};
`

export const Title = styled.a`
  display: flex;
  align-items: center;
  pointer-events: auto;
  justify-self: flex-start;
  margin-right: 12px;
  font-weight: 600;
  font-size: 18px;
  line-height: 22px;
  color: ${({ theme }) => theme.text1};
  text-decoration: none;
  gap: 14px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    justify-self: center;
    `};
  :hover {
    cursor: pointer;
  }
  span {
    padding-bottom: 4px;
  }
`

export const UniIcon = styled.div`
  transition: transform 0.3s ease;
  :hover {
    transform: rotate(-5deg);
  }
`

const activeClassName = 'ACTIVE'

export const StyledNavLink = styled(NavLink).attrs({
  activeClassName
})`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: left;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.text2};
  font-size: 1rem;
  height: 40px;
  line-height: 40px;
  width: fit-content;
  margin: 0 12px;
  font-weight: 500;

  &.${activeClassName} {
    font-weight: 600;
    color: ${({ theme }) => theme.text1};
    border-bottom-width: 4px;
    border-bottom-style: solid;
    border-bottom-color: ${({ theme }) => theme.blue4};
  }

  :hover,
  :focus {
    color: ${({ theme }) => darken(0.1, theme.white)};
  }
`

export const StyledMenuButton = styled.button`
  position: relative;
  width: 100%;
  height: 100%;
  border: none;
  background-color: transparent;
  margin: 0;
  padding: 0;
  height: 35px;
  background-color: ${({ theme }) => theme.bg3};
  margin-left: 8px;
  padding: 0.15rem 0.5rem;
  border-radius: 0.5rem;

  :hover,
  :focus {
    cursor: pointer;
    outline: none;
    background-color: ${({ theme }) => theme.bg4};
  }

  svg {
    margin-top: 2px;
  }
  > * {
    stroke: ${({ theme }) => theme.text1};
  }
`

export const StyledBurger = styled.div<{ open: boolean }>`
  width: 2rem;
  height: 2rem;
  position: fixed;
  top: 15px;
  right: 20px;
  z-index: 20;
  display: none;
  @media (max-width: 768px) {
    display: flex;
    justify-content: space-around;
    flex-flow: column nowrap;
  }
  div {
    width: 2rem;
    height: 0.25rem;
    background-color: ${({ open }) => (open ? '#ccc' : '#ffffff')};
    border-radius: 10px;
    transform-origin: 1px;
    transition: all 0.3s linear;
    &:nth-child(1) {
      transform: ${({ open }) => (open ? 'rotate(45deg)' : 'rotate(0)')};
    }
    &:nth-child(2) {
      transform: ${({ open }) => (open ? 'translateX(100%)' : 'translateX(0)')};
      opacity: ${({ open }) => (open ? 0 : 1)};
    }
    &:nth-child(3) {
      transform: ${({ open }) => (open ? 'rotate(-45deg)' : 'rotate(0)')};
    }
  }
`

export const MobileMenuList = styled.ul<{ open: boolean }>`
  list-style: none;
  display: flex;
  flex-flow: row nowrap;
  li {
    padding: 18px 10px;
  }
  flex-flow: column nowrap;
  background-color: rgb(64, 68, 79);
  position: fixed;
  top: -15px;
  left: 0;
  border-radius: 8px;
  width: 100%;
  height: 100%;
  padding: 0.5rem;
  transition: transform 0.3s ease-in-out;
  li {
    color: #ffffff;
  }

  > a {
    color: white;
    text-decoration: none;
    font-size: 18px;
  }
`

export const LogoWrapper = styled.div`
  min-width: 262px;
`

export const StyledMenuItem = styled.li``
