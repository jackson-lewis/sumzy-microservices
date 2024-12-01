export type TransactionType = 'one_time' | 'recurring'
export type EventType = 'created' | 'updated' | 'deleted'
export type AggregateType = 'expense' | 'income'
export type ComparePeriod = 'prevMonth' | 'yearOverYear'

export type Transaction = {
  _id: string
  type: TransactionType
  userId: string
  date: Date
  amount: number
}

export type Expense = Transaction & {
  category: string
  frequency?: 'monthly'
}

export type Income = Transaction

export type Event<T = AggregateType> = {
  aggregateId: string
  aggregateType: T
  eventData: T extends 'expense' ? Expense : Income
  eventType: EventType
  createdAt: Date
  version: number
}

export type ExpenseEvent = Event<'expense'>
export type IncomeEvent = Event<'income'>

export type Totals = {
  income: number
  expense: number
  surplus: number
}

export type ReportTotals = Totals & {
  expenseCategories?: {
    [k: string]: number
  }
}

export type CompareTotals = {
  [k in keyof Totals]: {
    amount: number
    percentage: number
  }
}