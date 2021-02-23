/* eslint-disable */
import React, { FC, useEffect, useState } from 'react'
import {
  Box,
  Button,
  Checkbox,
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
  Theme
} from '@material-ui/core'
import clsx from 'clsx'
import { useDarkModeManager } from 'state/user/hooks'
import { AccountBalanceData, getComparator, HeadCell, Order, stableSort } from '../Table/common/utils'
import { EnhancedTableHead } from '../Table/common/EnhancedTableHead'
import SearchIcon from '@material-ui/icons/Search'
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight'

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
  { id: 'img', numeric: false, disablePadding: true, label: '' },
  { id: 'coin', numeric: false, disablePadding: true, label: 'Assets' },
  { id: 'balance', numeric: true, disablePadding: false, label: 'Total' },
  { id: 'available', numeric: true, disablePadding: false, label: 'Length' },
  { id: 'borrowed', numeric: true, disablePadding: false, label: 'Rate' },
  { id: 'ir', numeric: true, disablePadding: false, label: 'Maturity' }
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
    tableHeader: {
      display: 'flex',
      justifyContent: 'space-between'
    },
    searchInput: {
      display: 'flex',
      alignItems: 'center',
      height: '30px',
      margin: 'auto 17px',
      padding: '0 4px 0 10px',
      border: 'solid #eee 2px',
      borderRadius: '15px',
      background: '#f7f8fa',
      ' & input ': {
        border: 'none'
      }
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
    },
    arrow: {
      transitionDuration: '0.2s',
      transitionProperty: 'transform',
      overflow: 'hidden',
      '&.rotate': {
        transform: 'rotate(90deg)'
      }
    },
    coin: {
      display: 'flex',
      alignItems: 'center',
      overflow: 'hidden'
      // justifyContent: 'space-between'
    },
    checkbox: {
      color: 'blue',
      '& .MuiTypography-root': {
        fontSize: 14
      }
    }
  })
)

interface BondRateCell {
  row: AccountBalanceData
  labelId: string
  isSelected: boolean
}

const BondHoldingsCells: FC<BondRateCell> = ({ row, labelId, isSelected }: BondRateCell) => {
  const classes = useStyles()
  return (
    <>
      <TableCell padding="checkbox" align="right">
        <img src={row.img} alt={row.coin} height={24} />
      </TableCell>
      <TableCell id={labelId} align="left">
        <div className={classes.coin}>
          {row.coin}
          <KeyboardArrowRightIcon
            className={clsx(classes.arrow, {
              rotate: isSelected
            })}
          />
        </div>
      </TableCell>
      <TableCell align="right">{row.balance.toFixed(6)}</TableCell>
      <TableCell align="right">{row.available.toFixed(6)}</TableCell>
      <TableCell align="right" padding="none">
        {row.borrowed.toFixed(6)}
      </TableCell>
      <TableCell align="right">{row.ir.toFixed(6)}</TableCell>
      <TableCell align="right">
        <Button variant="text" style={{ textTransform: 'none' }} color="primary" onClick={e => e.stopPropagation()}>
          Withdraw
        </Button>
      </TableCell>
    </>
  )
}

const FormCheckbox = ({ title, label }: { title: string; label: string }) => {
  const classes = useStyles()
  return (
    <FormControlLabel control={<Checkbox name={title} color="primary" />} label={label} className={classes.checkbox} />
  )
}

const AccountBalanceSecondaryCells = ({ isItemSelected }: { isItemSelected: boolean }) => (
  <TableRow>
    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
      <Collapse in={isItemSelected} timeout="auto" unmountOnExit>
        <Box margin={6}>
          <form style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', marginLeft: 100 }}>
            <FormCheckbox title="Daily" label={`Daily ${5.89}`} />
            <FormCheckbox title="Weekly" label={`Weekly ${8.5}`} />
            <FormCheckbox title="Monthly" label={`Monthly ${12.5} %`} />
            <FormCheckbox title="Yearly" label={`Yearly ${15} %`} />
            <Button color="primary" variant="contained">
              BUY
            </Button>
          </form>
        </Box>
      </Collapse>
    </TableCell>
  </TableRow>
)

export default function BondHoldingsTable({ tokens }: any) {
  const classes = useStyles()
  const [order, setOrder] = useState<Order>('asc')
  const [orderBy, setOrderBy] = useState<keyof AccountBalanceData>('coin')
  const [selected, setSelected] = useState<string[]>([])
  const [page, setPage] = useState(0)
  const [dense, setDense] = useState(false)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [rows, setRows] = useState([createAccountBalanceData('', '', 0, 0, 0, 0)])
  const [searchRows, setSearchRows] = useState(rows)
  const [search, setSearch] = useState<string>('')
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
    setSearchRows(newTokens)
  }, [tokens])

  useEffect(() => {
    const newRows: AccountBalanceData[] = []
    rows.map(row => {
      if (row.coin.toLowerCase().startsWith(search.toLowerCase())) newRows.push(row)
    })
    setSearchRows(newRows)
  }, [search])

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
      <Paper className={classes.paper}>
        <div
          className={clsx(classes.tableHeader, {
            [classes.darkMode]: darkMode
          })}
        >
          <h3>Bond Holdings</h3>
          <div className={classes.searchInput}>
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} />
            <SearchIcon />
          </div>
        </div>
        <TableContainer>
          <Table
            className={clsx(classes.table, {
              [classes.darkMode]: darkMode
            })}
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
              rowCount={searchRows.length}
              headCells={headCellsAccountBalance}
              withActions={true}
            />
            <TableBody>
              {stableSort(searchRows, getComparator(order, orderBy))
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
                        key={row.coin}
                        selected={isItemSelected}
                      >
                        <BondHoldingsCells row={row} labelId={labelId} isSelected={isItemSelected} />
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
          count={searchRows.length}
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
