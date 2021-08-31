import React from 'react'
import styled from 'styled-components'

interface BodyWrapperProps {
  roundedBody: boolean
}

export const BodyWrapper = styled.div<BodyWrapperProps>`
  position: relative;
  max-width: 420px;
  width: 100%;
  background: initial;
  border-radius: ${props => (props.roundedBody ? '30px' : '0')};
  border: 1px solid #777777;
`

/**
 * The styled container element that wraps the content of most pages and the tabs.
 */
export default function AppBody({
  children,
  roundedBody = true
}: {
  children: React.ReactNode
  roundedBody?: boolean
}) {
  return <BodyWrapper roundedBody={roundedBody}>{children}</BodyWrapper>
}
