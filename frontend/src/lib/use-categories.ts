import { useContext } from 'react'
import { CategoryContext } from './categories-context'

export default function useCategories() {
  const context = useContext(CategoryContext)

  if (!context) {
    throw new Error('useCategories must be used within a CategoryProvider')
  }

  return context
}
