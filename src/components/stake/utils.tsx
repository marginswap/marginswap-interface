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

export function getNotificationMsn(isAble: boolean, isError: boolean): string {
  if (isError) return 'Not Approved Transaction'

  if (!isAble) return 'Enter Amount'

  return 'Ok'
}
