import styled from 'styled-components'

export const StyledSelect = styled.select`
  display: flex;
  background-color: ${({ theme }) => theme.primary1};
  height: 40px;
  width: 48%;
  border-radius: 10px;
  color: ${({ theme }) => theme.white} !important;
  text-align: center;
  border: 1px solid ${({ theme }) => theme.black};
  font-size: 16px;
  font-weight: 600;
  padding: 0.6em 1.4em 0.5em 0.8em;
  line-height: 1.3;
  background-image: url("data:image/svg+xml;utf8,<svg fill='white' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/><path d='M0 0h24v24H0z' fill='none'/></svg>");
  background-repeat: no-repeat;
  background-position-x: 100%;
  background-position-y: center;
  appearance: none;
`
