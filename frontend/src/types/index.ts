export type TransactionDirection = 'income' | 'expense'
export type TransactionFrequency = 'one_time' | 'recurring'
export type ComparePeriod = 'prevMonth' | 'yearOverYear'

export type Transaction = {
  id: number
  userId: number
  date: string
  amount: number
  description: string
  category: number
  frequency: TransactionFrequency
}

export type Category = {
  id: number
  userId: number
  name: string
}

export type CategoryWithAmount = {
  amount: number
} & Category

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
  tCategories: {
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

export type TransactionDialogSetup = [
  TransactionDirection | undefined,
  TransactionFrequency | undefined
]

export type User = {
  name: string
  email: string
}

export type LoginCredentials = {
  email: string
  password: string
}

export type UserToken = {
  token: string
  message?: string
}
