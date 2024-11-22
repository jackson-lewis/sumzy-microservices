import { addExpense } from '@/lib/expense'
import { Expense } from '@/types'
import { Dispatch, SetStateAction } from 'react'
import DateSelector from './date-selector'
import useCategories from '@/lib/use-categories'

export default function AddExpense({
  setExpenses
}: {
  setExpenses: Dispatch<SetStateAction<Expense[]>>
}) {
  const { categories } = useCategories()

  return (
    <form onSubmit={async (event) => {
      event.preventDefault()

      const data = new FormData(event.target as HTMLFormElement)
      const expense: unknown = Object.fromEntries(data.entries())
      const added = await addExpense(expense as Expense)
      
      if (added instanceof Error) {
        console.error(added.message)
        return
      }

      setExpenses((expenses) => {
        return [
          ...expenses,
          added
        ]
      })
    }}>
      <input type="number" name="amount" step="0.01" required />
      <select name="category" required>
        {categories.map((category) => (
          <option
            key={category._id}
            value={category._id}
          >
            {category.name}
          </option>
        ))}
      </select>
      <DateSelector />
      <button>Add</button>
    </form>
  )
}
