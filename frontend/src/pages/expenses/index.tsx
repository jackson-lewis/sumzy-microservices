import ExpenseDialog from '@/components/expenses/dialog'
import ExpensesList from '@/components/expenses/list'
import { getExpenses } from '@/lib/expense'
import useExpenses from '@/lib/use-expenses'
import { Expense } from '@/types'
import { useEffect, useState } from 'react'

export default function Expenses() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const { expense, showEditModal } = useExpenses()

  useEffect(() => {
    async function getData() {
      const expenses = await getExpenses()
      if (Array.isArray(expenses)) {
        setExpenses(expenses)
      }

      if (expenses instanceof Error) {
        alert(expenses.message)
      }
    }
    getData()
  }, [])

  return (
    <main>
      <h1>Expenses</h1>
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