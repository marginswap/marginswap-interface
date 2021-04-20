import styled from 'styled-components'

export const StyledWrapperDiv = styled.div`
  display: flex;
  flex-direction: column;
<<<<<<< HEAD
  width: 75%;
  padding-right: 20px;
  @media (max-width: 768px) {
    width: 95%;
    justify-content: center;
    padding-right: 0px;
    margin-left: 5vw;
  }
=======
  width: 100%;
  max-width: 1040px;
>>>>>>> 4fc88d2a7bff66495bc202cb690e89a955c2e72a
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
