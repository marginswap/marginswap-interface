import { useStyles, ParameterTitle, ParameterResult } from './styleds'
import Tooltip from '@material-ui/core/Tooltip'
import question from '../../assets/svg/question.svg'
import React, { FunctionComponent } from 'react'

const Parameters: FunctionComponent<{
  title: string
  value: string | number
  hint?: string
}> = ({ title, value, hint }) => {
  const classes = useStyles()

  return (
    <p>
      <ParameterTitle>
        {title}
        {hint && (
          <Tooltip title={hint} placement="right" classes={{ tooltip: classes.tooltip }} arrow>
            <img src={question} width={16} height={16} alt="?" />
          </Tooltip>
        )}
      </ParameterTitle>
      <ParameterResult>{value}</ParameterResult>
    </p>
  )
}

export default Parameters
