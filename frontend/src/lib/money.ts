export function formatAmount(amount: number) {
  const options: Intl.NumberFormatOptions = {
    style: 'currency',
    currency: 'GBP'
  }

  return amount.toLocaleString('en-GB', options)
}

export function formatDate(date: Date) {
  const _date = new Date(date)

  return _date.toLocaleDateString('en-GB')
}