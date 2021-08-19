import React from 'react'
import { makeStyles } from '@material-ui/core'
import Graphic from 'components/Graphic'
import { firstChartState, secondChartState } from './constants'

const useStyles = makeStyles(() => ({
  graphics: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    gap: '27px',
    width: '1040px'
  }
}))

type GraphicProps = {
  series: { time: string; value: number }[]
}

export const Graphics = ({ series }: GraphicProps) => {
  const classes = useStyles()

  return (
    <div className={classes.graphics}>
      <Graphic series={series} />
      <Graphic series={series} />
    </div>
  )
}
