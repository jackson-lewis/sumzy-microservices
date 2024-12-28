import { Category } from '@/types'
import { deleteCategory } from '@/lib/category'

export default function CategoryItem({
  category
} : {
  category: Category,
}) {
  async function handleDeleteClick(
    event: React.MouseEvent<HTMLButtonElement>
  ) {
    const data = await deleteCategory(category.id)
    if (data instanceof Error) {
      console.error(data.message)
      return
    }
  }

  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
      <p>{category.name}</p>
      <button onClick={handleDeleteClick}>delete</button>
    </div>
  )
}
