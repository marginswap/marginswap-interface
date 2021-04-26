import {
  StyledFormControlLabel,
  StyledTable,
  StyledTableCell,
  StyledTableRow,
  StyledTableSortLabel,
  StyledTableWrapper
} from './styled'
import {
  Box,
  CircularProgress,
  Collapse,
  Switch,
  TableBody,
  TableContainer,
  TableHead,
  TableRow
} from '@material-ui/core'
import React, { ChangeEvent, Fragment, useMemo, useState } from 'react'
import { colors, StyledButton, StyledTextField } from '../../theme'

type TableAction<T extends Record<string, string | boolean | number>> = {
  name: string
  onClick: (row: T, amount: number, rowIndex: number) => void | Promise<void>
  deriveMaxFrom?: keyof T // which field defines max available value
  max?: number // or set max from external source
  disabled?: boolean | ((row: T) => boolean)
}

type TableProps<T extends Record<string, string | boolean | number>> = {
  title: string
  data: (T & {
    getActionNameFromAmount?: { [key: string]: (amount: number) => string }
    customActions?: readonly TableAction<T>[]
  })[]
  columns: readonly {
    id: keyof T
    name: string
    render?: (token: T) => JSX.Element
  }[]
  actions?: readonly TableAction<T>[]
  deriveEmptyFrom?: string[] // which fields are used for hiding empty rows
  idCol: keyof T
}

const TokensTable: <T extends { [key: string]: string | boolean | number }>(props: TableProps<T>) => JSX.Element = ({
  title,
  data,
  columns,
  actions,
  deriveEmptyFrom,
  idCol
}) => {
  const [hideEmpty, setHideEmpty] = useState(false)
  const [order, setOrder] = useState<'asc' | 'desc'>('asc')
  const [orderBy, setOrderBy] = useState(columns[0].id)
  const [activeAction, setActiveAction] = useState<{ actionIndex: number; rowIndex: number } | null>(null)
  const [actionAmount, setActionAmount] = useState('')
  const [actionLoading, setActionLoading] = useState(false)

  const areFieldsEmpty = (token: any) => {
    const nonZeroFiels = deriveEmptyFrom?.filter(d => token[d] !== 0) || []
    return nonZeroFiels?.length > 0
  }

  const sortedData = useMemo(
    () =>
      data
        .filter(token => (deriveEmptyFrom?.length && hideEmpty ? areFieldsEmpty(token) : true))
        .sort((a, b) =>
          typeof a[orderBy] === 'number'
            ? order === 'asc'
              ? Number(a[orderBy]) - Number(b[orderBy])
              : Number(b[orderBy]) - Number(a[orderBy])
            : order === 'asc'
            ? String(a[orderBy]).toLowerCase() > String(b[orderBy]).toLowerCase()
              ? 1
              : -1
            : String(a[orderBy]).toLowerCase() < String(b[orderBy]).toLowerCase()
            ? 1
            : -1
        ),
    [data, order, orderBy, hideEmpty, deriveEmptyFrom]
  )

  const handleActionOpen = (actionIndex: number, rowIndex: number) => {
    setActionAmount('')
    setActiveAction({ actionIndex, rowIndex })
  }

  const handleActionValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!(actions && activeAction)) return
    const currentAction =
      activeAction.actionIndex < actions.length
        ? actions[activeAction.actionIndex]
        : sortedData[activeAction.rowIndex].customActions![activeAction.actionIndex - actions.length]
    if (!e.target.value || !(currentAction.deriveMaxFrom || currentAction.max !== undefined)) {
      setActionAmount(e.target.value)
    } else {
      setActionAmount(
        String(
          Math.floor(
            Math.min(
              Number(e.target.value),
              Number(currentAction.max ?? sortedData[activeAction.rowIndex][currentAction.deriveMaxFrom!])
            ) * 1000000
          ) / 1000000
        )
      )
    }
  }

  const handleActionSubmit = async () => {
    if (!(actions && activeAction)) return
    const currentAction =
      activeAction.actionIndex < actions.length
        ? actions[activeAction.actionIndex]
        : sortedData[activeAction.rowIndex].customActions![activeAction.actionIndex - actions.length]
    setActionLoading(true)
    const res = currentAction.onClick(sortedData[activeAction.rowIndex], Number(actionAmount), activeAction.rowIndex)
    if (res instanceof Promise) {
      res
        .then(() => {
          setActionLoading(false)
        })
        .catch(() => {
          setActionLoading(false)
        })
    } else {
      setActionLoading(false)
    }
  }

  const handleSortChange = (column: typeof columns[number]['id']) => {
    const isAsc = orderBy === column && order === 'asc'
    setActiveAction(null)
    setActionAmount('')
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(column)
  }

  return (
    <div>
      <StyledTableWrapper>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginRight: '24px' }}>
          <h3>{title}</h3>
          {deriveEmptyFrom?.length && (
            <StyledFormControlLabel
              control={
                <Switch
                  checked={hideEmpty}
                  onChange={() => {
                    setHideEmpty(prev => !prev)
                  }}
                />
              }
              label="Hide zero balances"
            />
          )}
        </div>
        <TableContainer>
          <StyledTable aria-labelledby="tableTitle" aria-label="enhanced table">
            <TableHead>
              <TableRow>
                <StyledTableCell width={52} style={{ borderBottom: 'none' }} />
                {columns.map(column => (
                  <StyledTableCell
                    key={column.id as string}
                    align="left"
                    sortDirection={orderBy === column.id ? order : false}
                    style={{ color: colors(true).text2 }}
                  >
                    <StyledTableSortLabel
                      active={orderBy === column.id}
                      direction={orderBy === column.id ? order : 'asc'}
                      onClick={() => {
                        handleSortChange(column.id)
                      }}
                    >
                      {column.name}
                    </StyledTableSortLabel>
                  </StyledTableCell>
                ))}
                {actions && actions.length > 0 && (
                  <StyledTableCell padding="default" style={{ color: colors(true).text2 }}>
                    Actions
                  </StyledTableCell>
                )}
                <StyledTableCell width={24} style={{ borderBottom: 'none' }} />
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedData.map((row, rowIndex) => {
                const allActions = [...(actions ?? []), ...(row.customActions ?? [])]
                return (
                  <Fragment key={row[idCol] as number}>
                    <StyledTableRow selected={activeAction?.rowIndex === rowIndex}>
                      <StyledTableCell width={52} style={{ borderBottom: 'none' }} />
                      {columns.map((column, colIndex) => (
                        <StyledTableCell key={colIndex}>
                          {column.render
                            ? column.render(row)
                            : typeof row[column.id] === 'number'
                            ? Math.round(Number(row[column.id]) * 1000000) / 1000000
                            : row[column.id]}
                        </StyledTableCell>
                      ))}
                      {allActions.length > 0 && (
                        <StyledTableCell align="left">
                          {allActions.map((action, actionIndex) => (
                            <StyledButton
                              key={actionIndex}
                              onClick={() => {
                                handleActionOpen(actionIndex, rowIndex)
                              }}
                              disabled={typeof action.disabled === 'function' ? action.disabled(row) : action.disabled}
                            >
                              {action.name}
                            </StyledButton>
                          ))}
                        </StyledTableCell>
                      )}
                      <StyledTableCell width={24} style={{ borderBottom: 'none' }} />
                    </StyledTableRow>
                    {allActions.length > 0 && (
                      <TableRow>
                        <StyledTableCell style={{ paddingBottom: 0, paddingTop: 0, borderBottom: 'none' }} colSpan={6}>
                          <Collapse in={activeAction?.rowIndex === rowIndex} timeout="auto" unmountOnExit>
                            <Box margin={6}>
                              <h4>{activeAction && allActions[activeAction.actionIndex]?.name}</h4>
                              <div style={{ display: 'flex', alignItems: 'center' }}>
                                <div style={{ position: 'relative' }}>
                                  <StyledTextField
                                    label="Amount"
                                    type="number"
                                    onChange={handleActionValueChange}
                                    value={actionAmount}
                                  />
                                  {activeAction &&
                                    (allActions[activeAction.actionIndex]?.deriveMaxFrom ||
                                      allActions[activeAction.actionIndex]?.max !== undefined) && (
                                      <StyledButton
                                        color="primary"
                                        style={{
                                          position: 'absolute',
                                          right: 0,
                                          top: '50%',
                                          padding: '4px 10px',
                                          margin: '-10px 0 0 0'
                                        }}
                                        onClick={() => {
                                          setActionAmount(
                                            String(
                                              allActions[activeAction.actionIndex].max ??
                                                row[allActions[activeAction.actionIndex].deriveMaxFrom!]
                                            )
                                          )
                                        }}
                                      >
                                        MAX
                                      </StyledButton>
                                    )}
                                </div>
                                <StyledButton
                                  color="primary"
                                  style={{ borderRadius: '16px', padding: '10px 16px', margin: '0 0 0 32px' }}
                                  onClick={handleActionSubmit}
                                  disabled={actionLoading}
                                >
                                  {activeAction &&
                                  row.getActionNameFromAmount &&
                                  allActions[activeAction.actionIndex] &&
                                  row.getActionNameFromAmount[allActions[activeAction.actionIndex].name]
                                    ? row.getActionNameFromAmount[allActions[activeAction.actionIndex].name](
                                        Number(actionAmount)
                                      )
                                    : 'Confirm Transaction'}
                                  {actionLoading && <CircularProgress size={20} color={'white' as any} />}
                                </StyledButton>
                              </div>
                            </Box>
                          </Collapse>
                        </StyledTableCell>
                      </TableRow>
                    )}
                  </Fragment>
                )
              })}
            </TableBody>
          </StyledTable>
        </TableContainer>
      </StyledTableWrapper>
    </div>
  )
}

export default TokensTable
