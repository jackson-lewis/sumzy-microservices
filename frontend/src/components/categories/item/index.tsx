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
    const data = await deleteCategory(category._id)
    if (data instanceof Error) {
      console.error(data.message)
      return
    }

    setCategories((categories) => {
      return categories.filter((_c) => {
        return _c._id !== category._id
      })
    })
  }

  return (
    <div>
      <p>{category.name}</p>
      <button onClick={handleDeleteClick}>delete</button>
    </div>
  )
}
