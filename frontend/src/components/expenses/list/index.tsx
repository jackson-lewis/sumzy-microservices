import { Dispatch, SetStateAction, useEffect } from 'react'
import { getExpenses } from '@/lib/expense'
import styles from './index.module.scss'
import ExpenseItem from '../item'
import { Expense } from '@/types'


export default function ExpensesList({
  expenses,
  setExpenses
}: {
  expenses: Expense[],
  setExpenses: Dispatch<SetStateAction<Expense[]>>
}) {
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
  }, [setExpenses])

  if (expenses.length === 0) {
    return (
      <p>Your expenses will show up here.</p>
    )
  }

  return (
    <div className={styles.expenses}>
      {expenses.map((expense) => (
        <ExpenseItem
          key={expense._id}
          expense={expense}
          setExpenses={setExpenses}
        />
      ))}
    </div>
  )
}