import ExpenseDialog from '@/components/expenses/dialog'
import ExpensesList from '@/components/expenses/list'
import useExpenses from '@/lib/use-expenses'
import { Expense } from '@/types'
import { useState } from 'react'

export default function Expenses() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const { expense, showEditModal } = useExpenses()

  return (
    <main>
      <h2>New expense</h2>
      <button onClick={() => showEditModal()}>Add</button>
      <ExpensesList
        expenses={expenses}
        setExpenses={setExpenses}
      />
      <ExpenseDialog
        expense={expense}
        setExpenses={setExpenses}
      />
    </main>
  )
}