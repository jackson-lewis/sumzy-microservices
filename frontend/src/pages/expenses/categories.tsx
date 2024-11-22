import AddCategory from '@/components/categories/add'
import CategoriesList from '@/components/categories/list'
import { Category } from '@/types'
import { useState } from 'react'

export default function ExpenseCatgories() {
  const [categories, setCategories] = useState<Category[]>([])

  return (
    <main>
      <h2>New expense category</h2>
      <AddCategory setCategories={setCategories} />
      <CategoriesList
        categories={categories}
        setCategories={setCategories}
        />
    </main>
  )
}