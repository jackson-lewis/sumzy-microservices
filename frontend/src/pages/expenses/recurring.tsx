import ExpensesList from '@/components/expenses/list'
import FrequencySelector from '@/components/transaction/frequency-selector'
import { getExpenses } from '@/lib/expense'
import useExpenses from '@/lib/use-expenses'
import { Transaction } from '@/types'
import { useEffect, useState } from 'react'

export default function RecurringExpenses() {
  const [expenses, setExpenses] = useState<Transaction[]>([])
  const { showEditModal } = useExpenses()

  useEffect(() => {
    async function getData() {
      const expenses = await getExpenses('recurring')
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
      <FrequencySelector direction="expense" />
      <button onClick={() => showEditModal()}>Add</button>
      <ExpensesList
        expenses={expenses}
        setExpenses={setExpenses}
      />
    </main>
  )
}