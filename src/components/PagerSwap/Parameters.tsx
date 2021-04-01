import { useTooltipStyles } from './useStyles'
import Tooltip from '@material-ui/core/Tooltip'
import question from '../../assets/svg/question.svg'
import React, { FunctionComponent } from 'react'

const Parameters: FunctionComponent<{
  parameters: (string | number)[]
}> = ({ parameters }) => {
  const classes = useTooltipStyles()

  return (
    <p>
      <span>
        {parameters[0]}
        {parameters[2] && (
          <Tooltip title={parameters[2]} placement="right" classes={{ tooltip: classes.tooltip }} arrow>
            <img src={question} width={16} height={16} alt="?" />
          </Tooltip>
        )}
      </span>
      <span>{parameters[1]}</span>
    </p>
  )
}

export default Parameters
