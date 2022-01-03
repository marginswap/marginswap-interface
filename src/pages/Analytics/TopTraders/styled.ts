import styled from 'styled-components'

export const Container = styled.div`
  color: #fff;
  width: 1040px;
  border: 1px solid #777777;
  background: inherit;
  box-shadow: 0px 0px 1px rgb(0 0 0 / 1%), 0px 4px 8px rgb(0 0 0 / 4%), 0px 16px 24px rgb(0 0 0 / 4%),
    0px 24px 32px rgb(0 0 0 / 1%);
  border-radius: 10px;
  backdrop-filter: blur(10px);

  .expand {
    margin: auto;
    margin-bottom: 6px;
    border: none;
    cursor: pointer;
    color: unset;
    background-color: inherit;
  }
`

export const Content = styled.div`
  margin: 12px 27px 0 60px;
  display: flex;
  flex-direction: column;
`

export const Title = styled.h3`
  color: #fff;
`

export const TableHead = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 2px solid gray;
  padding: 10px 0px;
`

export const Cell = styled.span`
  text-align: end;
  cursor: pointer;
  font-size: 13px;
  line-height: 16px;

  &:first-child {
    width: 50%;
    text-align: inherit;
    cursor: inherit;
  }
`

export const WalletsList = styled.div``

export const WalletListItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 3px solid #80808033;
  padding: 10px 0 16px 0;

  .no-data {
    width: 100%;
    display: flex;
    height: 14px;
    border-radius: 4px;
  }
`

export const WalletListItemText = styled.span<{ monospaced?: boolean }>`
  width: 16.6%;
  text-align: end;
  font-size: ${props => (props.monospaced ? '0.9rem' : '12px')};
  line-height: 15px;
  font-family: ${props => props.monospaced && 'monospace !important'};

  &:first-child {
    width: 50%;
    text-align: inherit;
  }
`
