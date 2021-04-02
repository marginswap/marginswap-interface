import React, { FunctionComponent } from 'react'
import { StyledCard, StyledInfoCardAmount, StyledInfoCardIconContainer, StyledInfoCardTitle } from './styled'

const InfoCard: FunctionComponent<{
  color?: 'primary' | 'secondary'
  whiteText?: boolean
  ghost?: boolean
  small?: boolean
  withUnderlyingCard?: boolean
  Icon: FunctionComponent
  title: string
  amount: number
}> = ({
  color = 'primary',
  whiteText = false,
  ghost = false,
  small = false,
  Icon,
  withUnderlyingCard = false,
  title,
  amount
}) => {
  return (
    <StyledCard color={color} whiteText={whiteText} ghost={ghost} small={small} withUnderlyingCard={withUnderlyingCard}>
      {small ? (
        <StyledInfoCardIconContainer color={color}>
          <Icon />
        </StyledInfoCardIconContainer>
      ) : (
        <Icon />
      )}
      <StyledInfoCardTitle>{title}</StyledInfoCardTitle>
      <StyledInfoCardAmount>{amount}</StyledInfoCardAmount>
    </StyledCard>
  )
}

export default InfoCard
