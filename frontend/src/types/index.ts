export type TransactionType = 'one_time' | 'recurring'
export type ComparePeriod = 'prevMonth' | 'yearOverYear'

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
  type: TransactionType
}

export type ReportTotals = {
  income: number
  expense: number
  surplus: number
}

export type CompareTotal = {
  amount: number
  percentage: number
}

export type Report = {
  _id: string
  userId: string
  totals: ReportTotals & {
    expenseCategories: {
      [k: string]: number
    }
  }
  compare: {
    [k in ComparePeriod]: {
      [k in keyof ReportTotals]: CompareTotal
    } | null
  }
  date: Date
  lastUpdatedDate: Date
}

export type Income = {
  _id: string
  type: TransactionType
  userId: string
  date: Date
  amount: number
  category: string
}