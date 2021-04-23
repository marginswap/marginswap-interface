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
  align-items: center;
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 20px;
  }
  margin: 20px 0;
`

export const StyledMobileOnlyRow = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  justify-content: space-around;
  @media (max-width: 768px) {
    gap: 15px;
    padding: 0;
  }
  padding: 20px;
`
