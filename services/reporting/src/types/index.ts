export type ExpenseType = 'one_time' | 'recurring'

export type Expense = {
  _id: string
  type: ExpenseType
  userId: string
  date: Date
  amount: number
  category: string
  frequency?: 'monthly'
}

export interface Income {
  _id: string
  userId: string
  date: Date
  amount: number
}

export type Event<T = AggregateType> = {
  aggregateId: string
  aggregateType: T
  eventData: T extends 'expense' ? Expense : Income
  eventType: 'created' | 'updated' | 'deleted'
  createdAt: Date
  version: number
}

export type ExpenseEvent = Event<'expense'>
export type IncomeEvent = Event<'income'>

export type EventType = 'created' | 'updated' | 'deleted'

export type AggregateType = 'expense' | 'income'


