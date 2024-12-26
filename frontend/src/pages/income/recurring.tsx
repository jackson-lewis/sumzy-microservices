import ExpensesList from '@/components/expenses/list'
import FrequencySelector from '@/components/transaction/frequency-selector'
import { getExpenses } from '@/lib/expense'
import { getIncomes } from '@/lib/income'
import useExpenses from '@/lib/use-expenses'
import { Transaction } from '@/types'
import { useEffect, useState } from 'react'

export default function RecurringIncome() {
  const [expenses, setExpenses] = useState<Transaction[]>([])
  const { showEditModal } = useExpenses()

  useEffect(() => {
    async function getData() {
      const expenses = await getIncomes('recurring')
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
      <h1>Recurring Incomes</h1>
      <FrequencySelector direction="income" />
      <button
        onClick={() => {
          showEditModal('income', 'recurring')
        }}
      >
        Add
      </button>
      <ExpensesList
        expenses={expenses}
        setExpenses={setExpenses}
      />
    </main>
  )
}