import { Dispatch, SetStateAction } from 'react'
import { addCategory } from '@/lib/category'
import { Category, TransactionDirection } from '@/types'

export default function AddCategory({
  setCategories,
  direction
} : {
  setCategories: Dispatch<SetStateAction<Category[]>>
  direction: TransactionDirection
}) {
  return (
    <form onSubmit={async (event) => {
      event.preventDefault()

      const data = new FormData(event.target as HTMLFormElement)
      const category: unknown = Object.fromEntries(data.entries())
      const added = await addCategory(category as Category, direction)
      
      if (added instanceof Error) {
        console.error(added.message)
        return
      }

      setCategories((categories) => {
        return [
          ...categories,
          added
        ]
      })
    }}>
      <fieldset name="direction">
        <div>
          <div>
            <input
              type="radio"
              name="direction"
              value="income"
              id="direction-income"
            />
            <label htmlFor="direction-income">Income</label>
          </div>
          <div>
            <input
              type="radio"
              name="direction"
              value="expense"
              id="direction-expense"
            />
            <label htmlFor="direction-expense">Expense</label>
          </div>
        </div>
      </fieldset>
      <label htmlFor="name">Name</label>
      <input type="text" name="name" id="name" required />
      <fieldset>
        <legend>Type</legend>
        <div>
          <input type="radio" name="type" id="type_one_time" value="one_time" />
          <label htmlFor="type_one_time">One-time</label>
        </div>
        <div>
          <input type="radio" name="type" id="type_recurring" value="recurring" />
          <label htmlFor="type_recurring">Recurring</label>
        </div>
      </fieldset>
      <button>Add</button>
    </form>
  )
}
