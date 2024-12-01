import { Expense, Income } from '@/types'

export function sortTransactionsByDate<T extends Expense | Income>(
  a: T,
  b: T
) {
  if (a.date > b.date) {
    return -1
  }

  if (a.date < b.date) {
    return 1
  }

  return 0
}