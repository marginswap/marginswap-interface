import React, { ChangeEvent, FunctionComponent } from 'react'
import { TokenInfo } from '@uniswap/token-lists'
import { useInputStyles, useStyles } from './useStyles'
import { Button } from '@material-ui/core'
import { CurrencyModal } from '../CurrencyModal'

const StakeInput: FunctionComponent<{
  title: string
  quantity: string
  setQuantity: (quantity: string) => void
  selectedTokenIndex: number | null
  hiddenTokenIndex: number | null
  selectToken: (token: number) => void
  tokens: (TokenInfo & { balance?: number; borrowable?: number })[]
  renderMax?: boolean
  isMargin?: boolean
}> = ({
  title,
  quantity,
  setQuantity,
  selectedTokenIndex,
  hiddenTokenIndex,
  selectToken,
  tokens,
  renderMax = false,
  isMargin = false
}) => {
  const classes = useInputStyles()
  const styles = useStyles()

  const handleSetMax = () => {
    if (!(selectedTokenIndex !== null && renderMax)) return
    setQuantity(
      String((tokens[selectedTokenIndex].balance ?? 0) + (isMargin ? tokens[selectedTokenIndex].borrowable ?? 0 : 0))
    )
  }

  const handleQuantityChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (
      selectedTokenIndex !== null &&
      tokens[selectedTokenIndex].balance !== undefined &&
      e.target.value !== '' &&
      renderMax
    ) {
      setQuantity(
        String(
          Math.min(
            Number(e.target.value),
            isMargin
              ? tokens[selectedTokenIndex].balance! + (tokens[selectedTokenIndex].borrowable ?? 0)
              : tokens[selectedTokenIndex].balance!
          )
        )
      )
    } else {
      setQuantity(e.target.value)
    }
  }

  return (
    <div className={classes.wrapper + ' ' + styles.fullWidthPair}>
      <p>
        <span>{title}</span>
        {selectedTokenIndex !== null && tokens[selectedTokenIndex].balance !== undefined && (
          <span>Balance: {tokens[selectedTokenIndex].balance}</span>
        )}
      </p>
      <div className={classes.input}>
        <input type="number" value={quantity} min={0} onChange={handleQuantityChange} className="value" />
        {renderMax && selectedTokenIndex !== null && (
          <Button variant="text" size="small" className={classes.maxButton} onClick={handleSetMax}>
            MAX
          </Button>
        )}
        <div className={classes.currencyWrapper}>
          <>
            <CurrencyModal
              tokens={tokens}
              selectedTokenIndex={selectedTokenIndex}
              hiddenTokenIndex={hiddenTokenIndex}
              selectToken={selectToken}
            />
          </>
        </div>
      </div>
    </div>
  )
}

export default StakeInput
