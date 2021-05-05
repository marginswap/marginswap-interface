import React from 'react'
import styled from 'styled-components'
import OndemandVideoIcon from '@material-ui/icons/OndemandVideoOutlined'

const StyledExplainerVideoLink = styled.div`
  align-self: center;

  a {
    color: #fff;
    text-decoration: none;
  }

  span {
    margin-left: 8px;
    vertical-align: super;
  }
`

const VideoExplainerLink = () => (
  <StyledExplainerVideoLink>
    <a href="https://www.youtube.com/watch?v=rGGPAOCpDRs" target="_blank" rel="noreferrer">
      <OndemandVideoIcon />
      <span>Watch a How-To Video</span>
    </a>
  </StyledExplainerVideoLink>
)

export default VideoExplainerLink
