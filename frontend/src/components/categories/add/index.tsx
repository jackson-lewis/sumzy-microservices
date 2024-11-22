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
      <input type="text" name="name" required />
      <button>Add</button>
    </form>
  )
}
