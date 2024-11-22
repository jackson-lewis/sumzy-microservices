import { getCategories } from '@/lib/category'
import { addExpense } from '@/lib/expense'
import { Category, Expense } from '@/types'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'

export default function AddExpense({
  setExpenses
}: {
  setExpenses: Dispatch<SetStateAction<Expense[]>>
}) {
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    async function getData() {
      const categories = await getCategories()
      if (Array.isArray(categories)) {
        setCategories(categories)
      }

      if (categories instanceof Error) {
        alert(categories.message)
      }
    }
    getData()
  }, [setCategories])

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
      <button>Add</button>
    </form>
  )
}
