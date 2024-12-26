import { Dispatch, SetStateAction } from 'react'
import { Category } from '@/types'
import { deleteCategory } from '@/lib/category'

export default function CategoryItem({
  category,
  setCategories
} : {
  category: Category,
  setCategories: Dispatch<SetStateAction<Category[]>>
}) {
  async function handleDeleteClick(
    event: React.MouseEvent<HTMLButtonElement>
  ) {
    const data = await deleteCategory(category.id)
    if (data instanceof Error) {
      console.error(data.message)
      return
    }

    setCategories((categories) => {
      return categories.filter((_c) => {
        return _c.id !== category.id
      })
    })
  }

  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
      <p>{category.name}</p>
      <button onClick={handleDeleteClick}>delete</button>
    </div>
  )
}
