export type TransactionType = 'one_time' | 'recurring'
export type ComparePeriod = 'prevMonth' | 'yearOverYear'

export type Expense = {
  id: number
  type: TransactionType
  userId: number
  date: Date
  amount: number
  category: number
  frequency?: 'monthly'
}

export type Category = {
  id: number
  userId: number
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

type TotalKeys = `t${Capitalize<keyof ReportTotals>}`

export type Report = {
  id: number
  userId: number
  tExpenseCats: {
    [k: number]: number
  }
  compare: {
    [k in ComparePeriod]: {
      [k in keyof ReportTotals]: CompareTotal
    } | null
  }
  date: Date
  lastUpdatedDate: Date
} & {
  [k in TotalKeys]: number
}

export type Income = {
  id: number
  type: TransactionType
  userId: number
  date: Date
  amount: number
  category: number
}