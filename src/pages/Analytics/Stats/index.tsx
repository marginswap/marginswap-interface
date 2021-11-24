import React from 'react'

import { Container, NameStats, Title, TimeDescription, Value } from './styled'

interface Props {
  title: string
  time?: string
  value?: number
}

const Stats: React.FC<Props> = ({ title, time, value }) => {
  return (
    <Container>
      <NameStats>
        <Title>{title}</Title>
        {time && <TimeDescription>{time}</TimeDescription>}
      </NameStats>
      <Value>{`$${new Intl.NumberFormat().format(Number(value))}`}</Value>
    </Container>
  )
}

export default Stats
