import { Divider } from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search'
import Dropdown from '../../assets/images/dropdown.svg'
import { TokenInfo } from '@uniswap/token-lists'
import Modal from '@material-ui/core/Modal'
import Backdrop from '@material-ui/core/Backdrop'
import Fade from '@material-ui/core/Fade'
import React, { FC, useEffect, useState } from 'react'
import { useModalStyles, useCurrencyStyles, StyledPaper, Search, ModalButton, CloseButton } from './useModalStyles'

export interface CurrencyInput {
  tokens: TokenInfo[]
  deal: {
    currency: TokenInfo | null
    setCurrency: React.Dispatch<React.SetStateAction<TokenInfo | null>>
  }
}

interface TokenInput {
  token: TokenInfo
  index: number
  deal: {
    currency: TokenInfo | null
    setCurrency: React.Dispatch<React.SetStateAction<TokenInfo | null>>
  }
  handleClose: () => void
}

const Token = ({ token, index, deal, handleClose }: TokenInput) => {
  const classes = useCurrencyStyles()

  return (
    <div
      key={index}
      className={classes.currency}
      onClick={() => {
        deal.setCurrency(token)
        handleClose()
      }}
    >
      <img src={token?.logoURI} alt={token?.chainId.toString()} className={classes.currencyImg} />
      <div>
        <h3>{token.symbol}</h3>
        <span>{token.name}</span>
      </div>
    </div>
  )
}

export const CurrencyModal: FC<CurrencyInput> = ({ tokens, deal }: CurrencyInput) => {
  const classes = useModalStyles()

  const [open, setOpen] = React.useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => {
    setSearch('')
    setOpen(false)
  }

  const [newTokens, setNewTokens] = useState<TokenInfo[]>([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    const unique: string[] = []
    setNewTokens(
      tokens.filter(({ symbol, logoURI }) => {
        if (!unique.includes(symbol) && logoURI) {
          unique.push(symbol)
          return true
        }
        return false
      })
    )
  }, [tokens])

  return (
    <div>
      <ModalButton type="button" onClick={handleOpen}>
        {deal.currency && newTokens ? (
          <>
            <img
              src={deal.currency?.logoURI}
              alt={deal.currency?.chainId.toString()}
              className={classes.currencyImg}
            />
            <span id="currencySymbol">{deal.currency?.symbol}</span>
            <img src={Dropdown} width="8px" height="14px" alt="_" id="dropdown" />
          </>
        ) : (
          <div id="select">
            <span>Select Token</span>
            <img src={Dropdown} width="8px" height="14px" alt="_" id="dropdown" />
          </div>
        )}
      </ModalButton>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500
        }}
      >
        <Fade in={open}>
          <StyledPaper>
            <div className={classes.modalHeader}>
              <h3>Select a token</h3>
              <CloseButton onClick={handleClose} />
            </div>
            <Search>
              <input type="text" placeholder="Search" onChange={e => setSearch(e.target.value)} autoFocus />
              <SearchIcon />
            </Search>
            <Divider />
            <div className={classes.currencyList}>
              {newTokens
                ?.filter(token => (search ? token.symbol.toLowerCase().startsWith(search.toLowerCase()) : true))
                .map((token, index) => (
                  <Token key={token.symbol} token={token} index={index} deal={deal} handleClose={handleClose} />
                ))}
            </div>
            <button
              className={classes.modalConfirm}
              onClick={() => {
                console.log('mock Manage')
              }}
            >
              Manage
            </button>
          </StyledPaper>
        </Fade>
      </Modal>
    </div>
  )
}
