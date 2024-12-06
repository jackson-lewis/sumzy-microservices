import { Dispatch, SetStateAction } from 'react'
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
  if (expenses.length === 0) {
    return (
      <p>Your expenses will show up here.</p>
    )
  }

  return (
    <div className={styles.expenses}>
      {expenses.map((expense) => (
        <ExpenseItem
          key={expense.id}
          expense={expense}
          setExpenses={setExpenses}
        />
      ))}
    </div>
  )
}