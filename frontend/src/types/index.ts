export type Expense = {
  _id: string
  userId: string
  date: Date
  amount: number
  category: string
}

export type Category = {
  _id: string
  userId: string
  name: string
}