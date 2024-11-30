import { Category, Expense } from '@/types'
import { createContext, Dispatch, ReactNode, RefObject, SetStateAction, useEffect, useRef, useState } from 'react'
import { getCategories } from './category'

export const ExpenseContext = createContext<{
  expense: Expense | undefined
  setExpense: Dispatch<SetStateAction<Expense | undefined>>
  categories: Category[]
  setCategories: Dispatch<SetStateAction<Category[]>>
  dialogRef: RefObject<HTMLDialogElement>
  showEditModal: (expense?: Expense) => void
  closeEditModal: () => void
} | null>(null)

export default function ExpenseProvider({
  children
}: {
  children: ReactNode
}) {
  const [expense, setExpense] = useState<Expense>()
  const [categories, setCategories] = useState<Category[]>([])
  const dialogRef = useRef<HTMLDialogElement>(null)

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
  }, [])

  function showEditModal(expense?: Expense) {
    const dialog = dialogRef.current

    if (!dialog) {
      return
    }

    setExpense(expense)

    dialog.showModal()
  }

  function closeEditModal() {
    const dialog = dialogRef.current

    if (!dialog) {
      return
    }

    dialog.close()
  }

  /**
   * Each time cateogories is modified, update the local storage
   */
  useEffect(() => {
    if (categories.length) {
      localStorage.setItem('categories', JSON.stringify(categories))
    }
  }, [categories])

  return (
    <ExpenseContext.Provider value={{
      expense,
      setExpense,
      categories,
      setCategories,
      dialogRef,
      showEditModal,
      closeEditModal
    }}>
      {children}
    </ExpenseContext.Provider>
  )
}