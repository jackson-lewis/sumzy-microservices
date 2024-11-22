import { Category } from '@/types'
import { createContext, Dispatch, ReactNode, SetStateAction, useEffect, useState } from 'react'
import { getCategories } from './category'

export const CategoryContext = createContext<{
  categories: Category[],
  setCategories: Dispatch<SetStateAction<Category[]>>
} | null>(null)

export default function CategoriesProvider({
  children
}: {
  children: ReactNode
}) {
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    async function getData() {
      const local = localStorage.getItem('categories')

      if (local) {
        setCategories(JSON.parse(local))
        return
      }

      const categories = await getCategories()

      if (Array.isArray(categories)) {
        localStorage.setItem('categories', JSON.stringify(categories))
        setCategories(categories)
      }

      if (categories instanceof Error) {
        alert(categories.message)
      }
    }
    getData()
  }, [setCategories])

  /**
   * Each time cateogories is modified, update the local storage
   */
  useEffect(() => {
    if (categories.length) {
      localStorage.setItem('categories', JSON.stringify(categories))
    }
  }, [categories])

  return (
    <CategoryContext.Provider value={{ categories, setCategories }}>
      {children}
    </CategoryContext.Provider>
  )
}