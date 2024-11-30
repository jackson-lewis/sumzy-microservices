import { Dispatch, SetStateAction } from 'react'
import { addCategory } from '@/lib/category'
import { Category } from '@/types'

export default function AddCategory({
  setCategories
} : {
  setCategories: Dispatch<SetStateAction<Category[]>>
}) {
  return (
    <form onSubmit={async (event) => {
      event.preventDefault()

      const data = new FormData(event.target as HTMLFormElement)
      const category: unknown = Object.fromEntries(data.entries())
      const added = await addCategory(category as Category)
      
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
