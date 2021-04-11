import styled from 'styled-components'

export const StyledWrapperDiv = styled.div`
    display: flex;
    flex-direction: row;
    padding-left: 20px;
    @media (max-width: 768px) {
        padding-left: 0px;
        max-width: 80vw;
    }
`

export const StyledSectionDiv = styled.div`
    display: flex;
    flex-direction: column;
    padding-right: 20px;
    @media (max-width: 768px) {
        padding-right: 0px;
        max-width: 80vw;
    }
    gap: 20px;
`

export const StyledTableContainer = styled.div`
    display: flex;
    justify-content: space-between;
    @media (max-width: 768px) {
        padding-top: 15px;
        flex-direction: column;
    }
    margin: 20px 0;
    align-items: center;
`

export const StyledMobileOnlyRow = styled.div`
    display: flex;
    flex-direction: row;
    @media (max-width: 768px) {
        gap: 15px;
    }
    padding: 20px;
`