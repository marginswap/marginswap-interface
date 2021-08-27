import { DateTime } from 'luxon'

export function getNotificationMsn(isAble: boolean, canWithdraw: boolean, isError: boolean): string {
  if (isError) return 'Not Approved Transaction'

  if (!isAble) return 'Enter an amount'

  if (!canWithdraw) return 'You are not able to withdraw'

  return 'Ok'
}

export function getAvailableWithdrawalTime(seconds: number | undefined): string {
  if (seconds === null || seconds === undefined) return 'N/A'
  return DateTime.local().plus({ seconds }).toLocaleString(DateTime.DATETIME_SHORT)
}
