import React, { FC, useEffect, useState, Fragment } from 'react'
import { Box, Collapse, FormControlLabel, Switch, TableBody, TableRow } from '@material-ui/core'
import { AccountBalanceData, getComparator, HeadCell, Order, stableSort } from '../Table/common/utils'
import { EnhancedTableHead } from '../Table/common/EnhancedTableHead'
import {
  StyledTableWrapper,
  StyledTable,
  StyledTableContainer,
  StyledTableCell,
  StyledTableRow
} from 'components/Table/common/StyledTable'
import { StyledButton, StyledTextField } from '../../theme'

function createAccountBalanceData(
  img: string,
  coin: string,
  balance: number,
  available: number,
  borrowed: number,
  ir: number
): AccountBalanceData {
  return {
    img,
    coin,
    balance,
    available,
    borrowed,
    ir
  }
}

const headCellsAccountBalance: HeadCell[] = [
  { id: 'coin', numeric: false, disablePadding: true, label: 'Coin' },
  { id: 'balance', numeric: true, disablePadding: false, label: 'Total Balance' },
  { id: 'available', numeric: true, disablePadding: false, label: 'Available' },
  { id: 'borrowed', numeric: true, disablePadding: false, label: 'Borrowed' },
  { id: 'ir', numeric: true, disablePadding: false, label: 'Interest Rate' }
]

interface AccountBalanceCell {
  row: AccountBalanceData
  labelId: string
}

const AccountBalanceCells: FC<AccountBalanceCell> = ({ row, labelId }) => (
  <>
    <StyledTableCell width={52} style={{ borderBottom: 'none' }} />
    <StyledTableCell id={labelId} align="left">
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img src={row.img} alt={row.coin} height={30} />
        <span style={{ marginLeft: '5px' }}>{row.coin}</span>
      </div>
    </StyledTableCell>
    <StyledTableCell align="left">{row.balance.toFixed(6)}</StyledTableCell>
    <StyledTableCell align="left">{row.available.toFixed(6)}</StyledTableCell>
    <StyledTableCell align="left" padding="none">
      {row.borrowed.toFixed(6)}
    </StyledTableCell>
    <StyledTableCell align="left">{row.ir.toFixed(6)}</StyledTableCell>
    <StyledTableCell align="left">
      <StyledButton onClick={e => e.stopPropagation()}>Borrow</StyledButton>
      <StyledButton onClick={e => e.stopPropagation()}>Repay</StyledButton>
      <StyledButton onClick={e => e.stopPropagation()}>Withdraw</StyledButton>
      <StyledButton onClick={e => e.stopPropagation()}>Deposit</StyledButton>
    </StyledTableCell>
    <StyledTableCell width={24} style={{ borderBottom: 'none' }} />
  </>
)

const AccountBalanceSecondaryCells = ({ isItemSelected }: { isItemSelected: boolean }) => (
  <TableRow>
    <StyledTableCell style={{ paddingBottom: 0, paddingTop: 0, borderBottom: 'none' }} colSpan={6}>
      <Collapse in={isItemSelected} timeout="auto" unmountOnExit>
        <Box margin={6}>
          <h4>Borrow / Lend</h4>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <StyledTextField label="Amount" type="number" />
              <StyledButton
                color="primary"
                style={{ position: 'absolute', right: 0, top: '50%', padding: '4px 10px', margin: '-10px 0 0 0' }}
              >
                MAX
              </StyledButton>
            </div>
            <StyledButton color="primary" style={{ borderRadius: '16px', padding: '10px 16px', margin: '0 0 0 32px' }}>
              Confirm Transaction
            </StyledButton>
          </div>
        </Box>
      </Collapse>
    </StyledTableCell>
  </TableRow>
)

export default function AccountBalanceTable({ tokens }: any) {
  const [order, setOrder] = useState<Order>('asc')
  const [orderBy, setOrderBy] = useState<keyof AccountBalanceData>('coin')
  const [selected, setSelected] = useState<string[]>([])
  const [dense, setDense] = useState(false)
  const [rows, setRows] = useState([createAccountBalanceData('', '', 0, 0, 0, 0)])

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
      .map(({ logoURI, symbol }: any) =>
        createAccountBalanceData(logoURI, symbol, Math.random(), Math.random(), Math.random(), Math.random())
      )
    setRows(newTokens)
  }, [tokens])

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof AccountBalanceData) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const handleClick = (event: React.MouseEvent<unknown>, name: string) => {
    const selectedIndex = selected.indexOf(name)
    let newSelected: string[] = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1))
    }
    setSelected(newSelected)
  }

  const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDense(event.target.checked)
  }

  const isSelected = (name: string) => selected.indexOf(name) !== -1

  return (
    <div>
      <StyledTableWrapper>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginRight: '24px' }}>
          <h3>Account Balance</h3>
          <FormControlLabel
            control={<Switch checked={dense} onChange={handleChangeDense} />}
            label="Hide zero balances (not implemented)"
          />
        </div>
        <StyledTableContainer>
          <StyledTable aria-labelledby="tableTitle" aria-label="enhanced table">
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
              headCells={headCellsAccountBalance}
              withActions={true}
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy)).map((row, index) => {
                const isItemSelected = isSelected(row.coin as string)
                const labelId = `enhanced-table-checkbox-${index}`

                return (
                  <Fragment key={index}>
                    <StyledTableRow
                      onClick={event => handleClick(event, row.coin)}
                      role="button"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.borrowed}
                      selected={isItemSelected}
                    >
                      <AccountBalanceCells row={row} labelId={labelId} />
                    </StyledTableRow>
                    <AccountBalanceSecondaryCells isItemSelected={isItemSelected} />
                  </Fragment>
                )
              })}
            </TableBody>
          </StyledTable>
        </StyledTableContainer>
      </StyledTableWrapper>
    </div>
  )
}
