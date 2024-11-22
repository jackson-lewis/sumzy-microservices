import { getCategories } from '@/lib/category'
import { Category } from '@/types'
import { Dispatch, SetStateAction, useEffect } from 'react'
import CategoryItem from '../item'

export default function CategoriesList({
  categories,
  setCategories
}: {
  categories: Category[]
  setCategories: Dispatch<SetStateAction<Category[]>>
}) {
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