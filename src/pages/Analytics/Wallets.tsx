import React, { useEffect, useState } from 'react'
import Collapse from '@material-ui/core/Collapse'
import { makeStyles, Paper } from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import IconButton from '@material-ui/core/IconButton'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  margin: 12px 27px 0 60px;
  flex-direction: column;
  color: ${({ theme }) => theme.text1};
`

const Root = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 2px solid gray;
  padding: 10px 0;
  font-size: 13px;
  line-height: 16px;
  color: ${({ theme }) => theme.text2};
`

const StyledWallet = styled.li`
  color: ${({ theme }) => theme.text1};
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 3px solid #80808033;
  padding: 10px 0 16px 0;
  & span {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 12px;
    line-height: 15px;
  }
`

export const useStyles = makeStyles(() => ({
  main: {
    width: '1040px',
    backdropFilter: 'blur(10px)',
    background: 'inherit',
    boxShadow:
      '0px 0px 1px rgb(0 0 0 / 1%), 0px 4px 8px rgb(0 0 0 / 4%), 0px 16px 24px rgb(0 0 0 / 4%), 0px 24px 32px rgb(0 0 0 / 1%)',
    borderRadius: '10px',
    border: '1px solid #777777',
    color: '#fff'
  },
  expand: {
    margin: 'auto',
    marginBottom: '6px',
    border: 'none',
    cursor: 'pointer',
    color: 'unset',
    backgroundColor: 'inherit'
  }
}))

interface WalletData {
  address: number
  volume: number
}

function createWalletData(address: number, volume: number): WalletData {
  return {
    address,
    volume
  }
}

const Wallet = ({ wallet }: { wallet: WalletData; index: number }) => {
  const numberFormat = new Intl.NumberFormat()
  const { address, volume } = wallet

  return (
    <StyledWallet key={address}>
      <span>{address}</span>
      <span>${numberFormat.format(volume)}</span>
    </StyledWallet>
  )
}

export const Wallets = ({ tokens }: any) => {
  const classes = useStyles()

  const [checked, setChecked] = useState(false)

  const [wallets, setWallets] = useState<WalletData[]>([createWalletData(0, 0)])
  const [renderedWallets, setRenderedWallets] = useState<JSX.Element[] | undefined>()

  useEffect(() => {
    const unique: string[] = []
    const newTokens = tokens
      .filter(({ symbol, logoURI }: any) => {
        if (!unique.includes(symbol) && logoURI) {
          unique.push(symbol)
          return true
        }
        return false
      })
      .map(({ address }: any) => createWalletData(address, Math.random() * 10000))
    setWallets(newTokens)
  }, [tokens])

  useEffect(() => {
    const renderResult: JSX.Element[] = []
    wallets.map((wallet, index) => renderResult.push(Wallet({ wallet, index })))
    setRenderedWallets(renderResult)
  }, [wallets])

  const handleChange = () => {
    setChecked(prev => !prev)
  }

  return (
    <Paper className={classes.main}>
      <Container>
        <h3>Top Traders</h3>
        <Root>
          <span>Wallet</span>
          <span>Volume (24hrs)</span>
        </Root>
        <div>{renderedWallets && renderedWallets.slice(0, 5)}</div>
        <Collapse in={checked}>
          <div>{renderedWallets && renderedWallets.slice(5)}</div>
        </Collapse>
        <IconButton className={classes.expand} onClick={handleChange}>
          {checked ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Container>
    </Paper>
  )
}
