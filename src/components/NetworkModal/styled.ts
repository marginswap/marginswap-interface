import styled from 'styled-components'
import { ButtonSecondary } from '../Button'

export const Wrapper = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap}
  margin: 0;
  padding: 1em;
  width: 100%;
`
export const HeaderRow = styled.div`
  padding: 1rem 1rem;
  font-weight: 500;
  color: ${props => (props.color === 'blue' ? ({ theme }) => theme.primary1 : 'inherit')};
  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding: 1rem;
  `};
  .colored-text-blue4 {
    font-weight: 500;
    color: ${({ theme }) => theme.blue4};
    text-transform: uppercase;
  }
  .colored-text-primary1 {
    font-weight: 500;
    color: ${({ theme }) => theme.primary1};
  }
`
export const ContentWrapper = styled.div`
  padding: 0.5rem;

  ${({ theme }) => theme.mediaWidth.upToMedium`padding: 1rem`};
`

export const NetworkContainer = styled.div`
  display: flex;
  align-items: center;
  border-radius: 5px;
  cursor: pointer;
`

export const NetworkDescription = styled.div`
  font-weight: 500;
  border-radius: 12px;
  color: ${({ theme }) => theme.white};
`

export const NetworkImg = styled.img`
  width: 32px;
  height: 32px
  border-radius: 25px;
  margin-right: 10px;
  margin-left: 10px;
  border-radius: 5px;
`
export const NetworkOption = styled(ButtonSecondary)`
  justify-content: flex-start;
  margin: 1em 0;

  .active {
    border: 1px solid ${({ theme }) => theme.primary3};
  }
`
