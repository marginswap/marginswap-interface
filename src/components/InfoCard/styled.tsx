import styled from 'styled-components'

export const StyledCard = styled.div<{
  color: 'primary' | 'secondary'
  ghost: boolean
  small: boolean
  withUnderlyingCard: boolean
}>`
  background: ${({ color, ghost, small }) =>
    color === 'primary'
      ? ghost || small
        ? 'linear-gradient(165deg, rgba(244, 112, 255, 0.25) 0%, rgba(113, 130, 135, 0) 50%)'
        : 'linear-gradient(270deg, #AD01FF 0%, #3122FB 100%)'
      : ghost || small
      ? 'linear-gradient(165deg, rgba(112, 221, 255, 0.25) 0%, rgba(113, 130, 135, 0) 50%)'
      : 'linear-gradient(270deg, #2DDE9E 0%, #4255FF 100%);'};
  width: ${({ small }) => (small ? 150 : 320)}px;
  height: 172px;
  color: white;
  display: flex;
  flex-direction: column;
  padding: 30px;
  justify-content: space-between;
  border-radius: 12px;
  position: relative;
  ${({ withUnderlyingCard }) =>
    withUnderlyingCard
      ? `
		&:before {
			content: "";
			position: absolute;
			left: 0;
			top: 0;
			width: 320px;
			height: 172px;
			background: linear-gradient(270deg, #2DDE9E 0%, #4255FF 100%);
			transform: rotate(-5deg);
			border-radius: 12px;
			z-index: -1;
			transform-origin: 50px 100px;
		}
	`
      : ''}
  ${({ small }) => (small ? 'align-items: center;' : '')}
	${({ ghost, small }) => (ghost || small ? 'border: 1px solid rgba(255, 255, 255, 0.5)' : '')}
`

export const StyledInfoCardIconContainer = styled.div<{ color: 'primary' | 'secondary' }>`
  width: 48px;
  height: 48px;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ color }) => (color === 'primary' ? '#A304FF' : '#30CFA9')};
`

export const StyledInfoCardTitle = styled.div`
  font-weight: 500;
  font-size: 14px;
  margin: auto 0 5px 0;
`

export const StyledInfoCardAmount = styled.div`
  font-weight: 500;
  font-size: 19px;
`
