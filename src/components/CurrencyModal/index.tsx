import React, { FunctionComponent, useState } from 'react'
import { Divider } from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search'
import XIcon from '../../assets/images/x.svg'
import Dropdown from '../../assets/images/dropdown.svg'
import { TokenInfo } from '@uniswap/token-lists'
import Modal from '@material-ui/core/Modal'
import Backdrop from '@material-ui/core/Backdrop'
import Fade from '@material-ui/core/Fade'
import { useModalStyles, useCurrencyStyles } from './useModalStyles'

export const CurrencyModal: FunctionComponent<{
  tokens: TokenInfo[]
  selectedTokenIndex: number | null
  hiddenTokenIndex: number | null
  selectToken: (tokenIndex: number) => void
}> = ({ tokens, selectedTokenIndex, hiddenTokenIndex, selectToken }) => {
  const classes = useModalStyles()
  const tokenClasses = useCurrencyStyles()

  const [isOpened, setIsOpened] = useState(false)
  const [search, setSearch] = useState('')

  const handleOpen = () => setIsOpened(true)

  const handleClose = () => {
    setIsOpened(false)
    setSearch('')
  }

  const handleSelectToken = (index: number) => {
    selectToken(index)
    handleClose()
  }

  return (
    <div>
      <button type="button" onClick={handleOpen} className={classes.modalButton}>
        {selectedTokenIndex !== null ? (
          <>
            <img
              src={tokens[selectedTokenIndex].logoURI}
              alt={tokens[selectedTokenIndex].chainId.toString()}
              className={classes.currencyImg}
            />
            <span id="currencySymbol">{tokens[selectedTokenIndex].symbol}</span>
            <img src={Dropdown} width="8px" height="14px" alt="_" id="dropdown" />
          </>
        ) : (
          <div id="select">
            <span>Select Token</span>
            <img src={Dropdown} width="8px" height="14px" alt="_" id="dropdown" />
          </div>
        )}
      </button>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={isOpened}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500
        }}
      >
        <Fade in={isOpened}>
          <div className={classes.paper}>
            <div className={classes.modalHeader}>
              <h3>Select a token</h3>
              <img src={XIcon} width="20px" height="20px" alt="X" onClick={handleClose} />
            </div>
            <div className={classes.search}>
              <input type="text" placeholder="Search" onChange={e => setSearch(e.target.value)} autoFocus />
              <SearchIcon />
            </div>
            <Divider />
            <div className={classes.currencyList}>
              {tokens?.map((token, index) =>
                token.symbol.toLowerCase().startsWith(search.toLowerCase()) && index !== hiddenTokenIndex ? (
                  <div
                    key={token.symbol}
                    className={tokenClasses.currency}
                    onClick={() => {
                      handleSelectToken(index)
                    }}
                  >
                    <img src={token?.logoURI} alt={token?.chainId.toString()} className={classes.currencyImg} />
                    <div>
                      <h3>{token.symbol}</h3>
                      <span>{token.name}</span>
                    </div>
                  </div>
                ) : null
              )}
            </div>
            <button
              className={classes.modalConfirm}
              onClick={() => {
                // TODO: is it needed?
                console.log('mock Manage')
              }}
            >
              Manage
            </button>
          </div>
        </Fade>
      </Modal>
    </div>
  )
}
