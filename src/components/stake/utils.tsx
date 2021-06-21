import { DateTime } from 'luxon'

export function getAPRPerPeriod(apr: any, period: string): number {
  switch (period) {
    case 'One month':
      return apr * 2
    case 'Three months':
      return apr * 3
    default:
      return apr
  }
}

export function getNotificationMsn(isAble: boolean, canWithdraw: boolean, isError: boolean): string {
  if (isError) return 'Not Approved Transaction'

  if (!isAble) return 'Enter an amount'

  if (!canWithdraw) return 'You are not able to withdraw'

  return 'Ok'
}

export function getAvailableWithdrawalTime(seconds: number | undefined): string {
  if (!seconds) return 'Unknow'
  return DateTime.local().plus({ seconds }).toLocaleString(DateTime.DATETIME_SHORT)
}
