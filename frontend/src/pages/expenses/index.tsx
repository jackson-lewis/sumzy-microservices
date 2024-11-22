import AddExpense from '@/components/expenses/add'
import ExpensesList from '@/components/expenses/list'
import { Expense } from '@/types'
import { useState } from 'react'

export default function Expenses() {
  const [expenses, setExpenses] = useState<Expense[]>([])

  return (
    <main>
      <h2>New expense</h2>
      <AddExpense
        setExpenses={setExpenses}
      />
      <ExpensesList
        expenses={expenses}
        setExpenses={setExpenses}
      />
    </main>
  )
}