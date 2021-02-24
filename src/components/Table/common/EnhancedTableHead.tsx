import {
  createStyles,
  lighten,
  makeStyles,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Theme
} from '@material-ui/core'
import React from 'react'
import { AccountBalanceData, HeadCell, Order } from './utils'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%'
    },
    paper: {
      width: '100%',
      marginBottom: theme.spacing(2),
      borderRadius: 20,
      overflow: 'hidden'
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

interface EnhancedTableProps {
  classes: ReturnType<typeof useStyles>
  numSelected?: number
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof AccountBalanceData) => void
  order: Order
  orderBy: string
  rowCount: number
  withActions: boolean
  headCells: HeadCell[]
}

export function EnhancedTableHead(props: EnhancedTableProps) {
  const { classes, order, orderBy, onRequestSort, headCells, withActions } = props
  const createSortHandler = (property: keyof AccountBalanceData) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property)
  }

  return (
    <TableHead>
      <TableRow>
        {(headCells as HeadCell[]).map(headCell => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
        {withActions && (
          <TableCell padding="default" align="right">
            Actions
          </TableCell>
        )}
      </TableRow>
    </TableHead>
  )
}
