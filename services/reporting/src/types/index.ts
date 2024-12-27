export type TransactionFrequency = 'one_time' | 'recurring'
export type EventType = 'created' | 'updated' | 'deleted'
export type AggregateType = 'expense' | 'income'
export type ComparePeriod = 'prevMonth' | 'yearOverYear'

export type Transaction = {
  id: number
  userId: string
  amount: number
  frequency: TransactionFrequency
  description: string
  merchant: string
  date: Date
}

export type Event<T = AggregateType> = {
  aggregateId: number
  aggregateType: T
  eventData: Transaction
  eventType: EventType
  createdAt: Date
}

export type Totals = {
  income: number
  expense: number
  surplus: number
}

export type ReportTotals = Totals & {
  categories?: {
    [k: string]: number
  }
}

export type CompareTotals = {
  [k in keyof Totals]: {
    amount: number
    percentage: number
  }
}