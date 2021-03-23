import { TableHead, TableRow } from '@material-ui/core'
import React, { FunctionComponent } from 'react'
import { AccountBalanceData, HeadCell, Order } from './utils'
import { StyledTableCell, StyledTableSortLabel } from './StyledTable'
import { colors } from '../../../theme'

// const useStyles = makeStyles((theme: Theme) =>
//   createStyles({
//     root: {
//       width: '100%'
//     },
//     paper: {
//       width: '100%',
//       marginBottom: theme.spacing(2),
//       borderRadius: 20,
//       overflow: 'hidden'
//     },
//     table: {
//       minWidth: 750
//     },
//     visuallyHidden: {
//       border: 0,
//       clip: 'rect(0 0 0 0)',
//       height: 1,
//       margin: -1,
//       overflow: 'hidden',
//       padding: 0,
//       position: 'absolute',
//       top: 20,
//       width: 1
//     },
//     pointer: {
//       cursor: 'pointer',
//       '&.Mui-selected': {
//         backgroundColor: lighten('#343D76', 0.85),
//         '&:hover': {
//           backgroundColor: lighten('#343D76', 0.85)
//         }
//       }
//     },
//     darkMode: {
//       backgroundColor: lighten('#343D76', 0.75)
//     }
//   })
// )

interface EnhancedTableProps {
  numSelected?: number
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof AccountBalanceData) => void
  order: Order
  orderBy: string
  rowCount: number
  withActions: boolean
  headCells: HeadCell[]
}

export const EnhancedTableHead: FunctionComponent<EnhancedTableProps> = ({
  order,
  orderBy,
  onRequestSort,
  headCells,
  withActions
}) => {
  const createSortHandler = (property: keyof AccountBalanceData) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property)
  }

  return (
    <TableHead>
      <TableRow>
        <StyledTableCell width={52} style={{ borderBottom: 'none' }} />
        {(headCells as HeadCell[]).map(headCell => (
          <StyledTableCell
            key={headCell.id}
            align="left"
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
            style={{ color: colors(true).text2 }}
          >
            <StyledTableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {/*{orderBy === headCell.id ? (*/}
              {/*  <span className={classes.visuallyHidden}>*/}
              {/*    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}*/}
              {/*  </span>*/}
              {/*) : null}*/}
            </StyledTableSortLabel>
          </StyledTableCell>
        ))}
        {withActions && (
          <StyledTableCell padding="default" style={{ color: colors(true).text2 }}>
            Actions
          </StyledTableCell>
        )}
        <StyledTableCell width={24} style={{ borderBottom: 'none' }} />
      </TableRow>
    </TableHead>
  )
}
