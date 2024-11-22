import { formatAmount, formatDate } from '@/lib/money'
import { Expense } from '@/types'
import { deleteExpense, getExpenseCategory, updateExpense } from '@/lib/expense'
import styles from './index.module.scss'
import { Dispatch, FormEvent, SetStateAction, useState } from 'react'
import useCategories from '@/lib/use-categories'
import CurrencyInput from '@/components/global/currency-input'


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
      <button
        onClick={handleDeleteClick}
        aria-label="Delete expense"
        className={styles.delete}
      >
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M304.62-160q-26.66 0-45.64-18.98T240-224.62V-720h-20q-8.5 0-14.25-5.76T200-740.03q0-8.51 5.75-14.24T220-760h140q0-12.38 9.19-21.58 9.19-9.19 21.58-9.19h178.46q12.39 0 21.58 9.19Q600-772.38 600-760h140q8.5 0 14.25 5.76t5.75 14.27q0 8.51-5.75 14.24T740-720h-20v495.38q0 26.66-18.98 45.64T655.38-160H304.62ZM680-720H280v495.38q0 10.77 6.92 17.7 6.93 6.92 17.7 6.92h350.76q10.77 0 17.7-6.92 6.92-6.93 6.92-17.7V-720ZM412.33-280q8.52 0 14.25-5.75t5.73-14.25v-320q0-8.5-5.76-14.25T412.28-640q-8.51 0-14.24 5.75T392.31-620v320q0 8.5 5.76 14.25 5.75 5.75 14.26 5.75Zm135.39 0q8.51 0 14.24-5.75t5.73-14.25v-320q0-8.5-5.76-14.25-5.75-5.75-14.26-5.75-8.52 0-14.25 5.75T527.69-620v320q0 8.5 5.76 14.25t14.27 5.75ZM280-720v520-520Z"/></svg>
      </button>
      <form onSubmit={handleUpdate}>
        <CurrencyInput
          value={amount}
          onChange={(event) => {
            setAmount(Number(event.target.value))
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
