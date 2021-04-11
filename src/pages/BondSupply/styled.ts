import styled from 'styled-components'

export const StyledWrapperDiv = styled.div`
  display: flex;
  flex-direction: column;
  width: 75%;
  padding-right: 20px;
  @media (max-width: 768px) {
    width: 95%;
    justify-content: center;
    padding-right: 0px;
  }
  gap: 20px;
`
export const StyledSectionDiv = styled.div`
  display: flex;
  flex-direction: column;
  padding-right: 20px;
  gap: 20px;
`
export const StyledTableContainer = styled.div`
  display: flex;
  justify-content: space-between;
  @media (max-width: 768px) {
    margin: auto;
    flex-direction: column;
    gap: 20px;
  }
  margin: 20px 0;
`
