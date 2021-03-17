/* eslint-disable */
import React, { FC, useEffect, useState } from 'react'
import {
  Box,
  Button,
  Collapse,
  createStyles,
  FormControlLabel,
  lighten,
  makeStyles,
  Paper,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  TextField,
  Theme,
  Typography
} from '@material-ui/core'
import clsx from 'clsx'
import { useDarkModeManager } from 'state/user/hooks'
import { AccountBalanceData, getComparator, HeadCell, Order, stableSort } from '../Table/common/utils'
import { EnhancedTableHead } from '../Table/common/EnhancedTableHead'
import { MarginAccount } from 'marginswap-sdk/src/index'

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

async function getAccountBalances(traderAddress: string) {
  return MarginAccount.getAccountBalances(traderAddress);
}

const headCellsAccountBalance: HeadCell[] = [
  { id: 'img', numeric: false, disablePadding: true, label: '' },
  { id: 'coin', numeric: false, disablePadding: true, label: 'Coin' },
  { id: 'balance', numeric: true, disablePadding: false, label: 'Total Balance' },
  { id: 'available', numeric: true, disablePadding: false, label: 'Available' },
  { id: 'borrowed', numeric: true, disablePadding: false, label: 'Borrowed' },
  { id: 'ir', numeric: true, disablePadding: false, label: 'Interest Rate' }
]

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%'
    },
    paper: {
      width: '100%',
      marginBottom: theme.spacing(2),
      borderRadius: 20,
      overflow: 'hidden',
      '& h3': {
        paddingLeft: '25px'
      }
    },
    table: {
      minWidth: 750
    },
    visuallyHidden: {
      border: 0,
      clip: 'rect(0 0 0 0)',
      height: 1,
      margin: -1,
      overflow: 'hidden',
      padding: 0,
      position: 'absolute',
      top: 20,
      width: 1
    },
    pointer: {
      cursor: 'pointer',
      '&.Mui-selected': {
        backgroundColor: lighten('#343D76', 0.85),
        '&:hover': {
          backgroundColor: lighten('#343D76', 0.85)
        }
      }
    },
    darkMode: {
      backgroundColor: lighten('#343D76', 0.75)
    }
  })
)

interface AccountBalanceCell {
  row: AccountBalanceData
  labelId: string
}

const AccountBalanceCells: FC<AccountBalanceCell> = ({ row, labelId }: AccountBalanceCell) => (
  <>
    <TableCell padding="checkbox" align="right">
      <img src={row.img} alt={row.coin} height={24} />
    </TableCell>
    <TableCell id={labelId} align="left">
      {row.coin}
    </TableCell>
    <TableCell align="right">{row.balance.toFixed(6)}</TableCell>
    <TableCell align="right">{row.available.toFixed(6)}</TableCell>
    <TableCell align="right" padding="none">
      {row.borrowed.toFixed(6)}
    </TableCell>
    <TableCell align="right">{row.ir.toFixed(6)}</TableCell>
    <TableCell align="right">
      <Button variant="text" style={{ textTransform: 'none' }} color="primary" onClick={e => e.stopPropagation()}>
        Borrow
      </Button>
      <Button variant="text" style={{ textTransform: 'none' }} color="primary" onClick={e => e.stopPropagation()}>
        Repay
      </Button>
      <Button variant="text" style={{ textTransform: 'none' }} color="primary" onClick={e => e.stopPropagation()}>
        Withdraw
      </Button>
      <Button variant="text" style={{ textTransform: 'none' }} color="primary" onClick={e => e.stopPropagation()}>
        Deposit
      </Button>
    </TableCell>
  </>
)

const AccountBalanceSecondaryCells = ({ isItemSelected }: { isItemSelected: boolean }) => (
  <TableRow>
    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
      <Collapse in={isItemSelected} timeout="auto" unmountOnExit>
        <Box margin={6}>
          <Typography variant="h6" gutterBottom component="div">
            Borrow / Lend
          </Typography>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around' }}>
            <TextField label="Amount" type="number" />
            <Button type="button" color="primary" variant="contained">
              Confirm Transaction
            </Button>
          </div>
        </Box>
      </Collapse>
    </TableCell>
  </TableRow>
)

export default function AccountBalanceTable({ tokens }: any) {
  const classes = useStyles()
  const [order, setOrder] = useState<Order>('asc')
  const [orderBy, setOrderBy] = useState<keyof AccountBalanceData>('coin')
  const [selected, setSelected] = useState<string[]>([])
  const [page, setPage] = useState(0)
  const [dense, setDense] = useState(false)
  const [rowsPerPage, setRowsPerPage] = useState(25)
  const [rows, setRows] = useState([createAccountBalanceData('', '', 0, 0, 0, 0)])
  const [darkMode] = useDarkModeManager()

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

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDense(event.target.checked)
  }

  const isSelected = (name: string) => selected.indexOf(name) !== -1

  return (
    <div className={classes.root}>
      <Paper
        className={clsx(classes.paper, {
          [classes.darkMode]: darkMode
        })}
      >
        <h3>Account Balance</h3>
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
              headCells={headCellsAccountBalance}
              withActions={true}
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.coin as string)
                  const labelId = `enhanced-table-checkbox-${index}`

                  return (
                    <>
                      <TableRow
                        hover
                        className={classes.pointer}
                        onClick={event => handleClick(event, row.coin)}
                        role="button"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.borrowed}
                        selected={isItemSelected}
                      >
                        <AccountBalanceCells row={row} labelId={labelId} />
                      </TableRow>
                      <AccountBalanceSecondaryCells isItemSelected={isItemSelected} />
                    </>
                  )
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          className={clsx({
            [classes.darkMode]: darkMode
          })}
          rowsPerPageOptions={[10, 25, 50, 100]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Hide zero balances (not implemented)"
      />
    </div>
  )
}
