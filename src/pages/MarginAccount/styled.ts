import styled from 'styled-components'

export const StyledWrapperDiv = styled.div`
  display: flex;
<<<<<<< HEAD
  width: 75%;
  flex-direction: row;
  padding-left: 20px;
  @media (max-width: 768px) {
    padding-left: 0px;
    margin-right: 10vw;
    max-width: 80vw;
  }
=======
  flex-direction: column;
  width: 100%;
  max-width: 1040px;
  gap: 20px;
>>>>>>> 4fc88d2a7bff66495bc202cb690e89a955c2e72a
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
