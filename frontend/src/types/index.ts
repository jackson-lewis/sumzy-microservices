export type TransactionType = 'one_time' | 'recurring'

export type Expense = {
  _id: string
  type: TransactionType
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
  totals: {
    income: number
    expense: number
    surplus: number
    expenseCategories: {
      [k: string]: number
    }
  }
  date: Date
}

export type Income = {
  _id: string
  type: TransactionType
  userId: string
  date: Date
  amount: number
}