import { Category } from '@/types'
import { Dispatch, SetStateAction } from 'react'
import CategoryItem from '../item'

export default function CategoriesList({
  categories,
  setCategories
}: {
  categories: Category[]
  setCategories: Dispatch<SetStateAction<Category[]>>
}) {
  if (categories.length === 0) {
    return (
      <p>Your categories will show up here.</p>
    )
  }

  return (
    <div>
      {categories.map((category) => (
        <CategoryItem
          key={category._id}
          category={category}
          setCategories={setCategories}
        />
      ))}
    </div>
  )
}