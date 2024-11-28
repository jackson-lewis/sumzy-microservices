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

export type Report = {
  _id: string
  userId: string
  categories: {
    [k: string]: number
  }
  total: number
  date: Date
}