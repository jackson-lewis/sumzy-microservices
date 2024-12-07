import { Dispatch, SetStateAction } from 'react'
import styles from './index.module.scss'
import ExpenseItem from '../item'
import { Transaction } from '@/types'


export default function ExpensesList({
  expenses,
  setExpenses
}: {
  expenses: Transaction[],
  setExpenses: Dispatch<SetStateAction<Transaction[]>>
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