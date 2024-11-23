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

export type Category = {
  _id: string
  userId: string
  name: string
}