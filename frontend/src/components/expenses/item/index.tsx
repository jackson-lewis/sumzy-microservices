import { formatAmount, formatDate } from '@/lib/money'
import { Expense } from '@/types'
import { deleteExpense, updateExpense } from '@/lib/expense'
import styles from './index.module.scss'
import { Dispatch, FormEvent, SetStateAction, useState } from 'react'


export default function ExpenseItem({
    expense,
    setExpenses
}: {
    expense: Expense,
    setExpenses: Dispatch<SetStateAction<Expense[]>>
}) {
  const formattedAmount = formatAmount(expense.amount)
  const formattedDate = formatDate(expense.date)

  async function handleDeleteClick(
    event: React.MouseEvent<HTMLButtonElement>
  ) {
    const data = await deleteExpense(expense._id)
    if (data instanceof Error) {
      console.error(data.message)
      return
    }

    setExpenses((expenses) => {
      return expenses.filter((_e) => {
        return _e._id !== expense._id
      })
    })
  }

  async function handleUpdate(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    const formData = new FormData(event.target as HTMLFormElement)
    const formDataEntries: unknown = Object.fromEntries(formData.entries())
    const _ue = formDataEntries as Expense
    const updated: Expense = {
      ...expense,
      ..._ue
    }

    const data = await updateExpense(updated)

    if (data instanceof Error) {
      console.error(data.message)
      return
    }

    setExpenses((expenses) => {
      return expenses.map((_e) => {
        if (_e._id === expense._id) {
          return updated
        }
        return _e
      })
    })
  }

  const categories: [
    string,
    Capitalize<string>
  ][] = [
    ['fuel', 'Fuel'],
    ['food', 'Food'],
    ['car', 'Car'],
    ['diy', 'DIY'],
    ['house', 'House'],
    ['eating_out', 'Easting Out']
  ]

  const [amount, setAmount] = useState(expense.amount)
  const [category, setCategory] = useState(expense.category)

  return (
    <div className={styles.expense}>
      <p>{formattedDate}</p>
      <p>{formattedAmount}</p>
      <p>{expense.category}</p>
      <button onClick={handleDeleteClick}>delete</button>
      <form onSubmit={handleUpdate}>
        <input
          type="number"
          name="amount"
          step="0.01"
          value={amount}
          required
          onChange={(event) => {
            setAmount(Number((event.target as HTMLInputElement).value))
          }}
        />
        <select
          name="category"
          value={category}
          required
          onChange={(event) => {
            setCategory((event.target as HTMLSelectElement).value)
          }}
        >
          {categories.map(([value, label]) => (
            <option
              key={value}
              value={value}
            >
              {label}
            </option>
          ))}
        </select>
        <button>update</button>
      </form>
    </div>
  )
}
