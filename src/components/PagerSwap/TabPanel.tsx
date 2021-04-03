import React, { FunctionComponent } from 'react'
import { Box } from '@material-ui/core'

const TabPanel: FunctionComponent<{
  activeIndex: number
  index: number
}> = ({ activeIndex, index, children }) => (
  <div role="tabpanel" hidden={activeIndex !== index} id={`nav-tabpanel-${index}`} aria-labelledby={`nav-tab-${index}`}>
    {activeIndex === index && <Box p={1}>{children}</Box>}
  </div>
)

export default TabPanel
