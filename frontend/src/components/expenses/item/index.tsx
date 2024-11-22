import { formatAmount, formatDate } from '@/lib/money'
import { Expense } from '@/types'
import { deleteExpense, getExpenseCategory, updateExpense } from '@/lib/expense'
import styles from './index.module.scss'
import { Dispatch, FormEvent, SetStateAction, useState } from 'react'
import useCategories from '@/lib/use-categories'


export default function ExpenseItem({
    expense,
    setExpenses
}: {
    expense: Expense,
    setExpenses: Dispatch<SetStateAction<Expense[]>>
}) {
  const formattedAmount = formatAmount(expense.amount)
  const formattedDate = formatDate(expense.date)
  const { categories } = useCategories()
  const category = getExpenseCategory(expense, categories)

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

  const [amount, setAmount] = useState(expense.amount)
  const [categoryInput, setCategoryInput] = useState(expense.category)

  return (
    <div className={styles.expense}>
      <p>{formattedDate}</p>
      <p>{formattedAmount}</p>
      <p>{category?.name}</p>
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
          value={categoryInput}
          required
          onChange={(event) => {
            setCategoryInput((event.target as HTMLSelectElement).value)
          }}
        >
          {categories.map((category) => (
            <option
              key={category._id}
              value={category._id}
            >
              {category.name}
            </option>
          ))}
        </select>
        <button>update</button>
      </form>
    </div>
  )
}
