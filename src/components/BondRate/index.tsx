import React, { FC, useEffect, useState } from 'react'
import {
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
import { BondRateData, getComparator, HeadCell, Order, stableSort } from '../Table/common/utils'
import { EnhancedTableHead } from '../Table/common/EnhancedTableHead'

function createBondRateData(
  img: string,
  coin: string,
  daily: number,
  weekly: number,
  monthly: number,
  yearly: number
): BondRateData {
  return {
    img,
    coin,
    daily,
    weekly,
    monthly,
    yearly
  }
}

const headCellsAccountBalance: HeadCell[] = [
  { id: 'img', numeric: false, disablePadding: true, label: '' },
  { id: 'coin', numeric: false, disablePadding: true, label: 'Token' },
  { id: 'balance', numeric: true, disablePadding: false, label: 'Daily' },
  { id: 'available', numeric: true, disablePadding: false, label: 'Weekly' },
  { id: 'borrowed', numeric: true, disablePadding: false, label: 'Monthly' },
  { id: 'ir', numeric: true, disablePadding: false, label: 'Yearly' }
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
  row: BondRateData
  labelId: string
}

const BondRateCells: FC<BondRateCell> = ({ row, labelId }: BondRateCell) => {
  const classes = useStyles()
  return (
    <>
      <TableCell padding="checkbox" align="right">
        <img src={row.img} alt={row.coin} height={24} />
      </TableCell>
      <TableCell id={labelId} align="left">
        <div className={classes.coin}>{row.coin}</div>
      </TableCell>
      <TableCell align="right">{row.daily.toFixed(1)}%</TableCell>
      <TableCell align="right">{row.weekly.toFixed(1)}%</TableCell>
      <TableCell align="right" padding="none">
        {row.monthly.toFixed(1)}%
      </TableCell>
      <TableCell align="right">{row.yearly.toFixed(1)}%</TableCell>
    </>
  )
}

export default function BondRateTable({ tokens }: any) {
  const classes = useStyles()
  const [order, setOrder] = useState<Order>('asc')
  const [orderBy, setOrderBy] = useState<keyof BondRateData>('coin')
  const [page, setPage] = useState(0)
  const [dense, setDense] = useState(false)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [rows, setRows] = useState([createBondRateData('', '', 0, 0, 0, 0)])
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
        createBondRateData(
          logoURI,
          symbol,
          Math.random() * 100,
          Math.random() * 100,
          Math.random() * 100,
          Math.random() * 100
        )
      )
    setRows(newTokens)
  }, [tokens])

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: any) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
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

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <div
          className={clsx(classes.tableHeader, {
            [classes.darkMode]: darkMode
          })}
        >
          <h3>Bond Rate</h3>
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
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
              headCells={headCellsAccountBalance}
              withActions={false}
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const labelId = `enhanced-table-checkbox-${index}`

                  return (
                    <>
                      <TableRow hover className={classes.pointer} role="button" tabIndex={-1} key={row.coin}>
                        <BondRateCells row={row} labelId={labelId} />
                      </TableRow>
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
