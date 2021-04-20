import styled from 'styled-components'

export const StyledWrapperDiv = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1130px;
  gap: 20px;
`
export const StyledSectionDiv = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
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
