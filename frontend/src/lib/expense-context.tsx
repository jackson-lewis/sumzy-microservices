import { Category, Transaction } from '@/types'
import { createContext, Dispatch, ReactNode, RefObject, SetStateAction, useEffect, useRef, useState } from 'react'
import { getCategories } from './category'
import { getExpenses } from './expense'

export const ExpenseContext = createContext<{
  expenses: Transaction[]
  setExpenses: Dispatch<SetStateAction<Transaction[]>>
  expense: Transaction | undefined
  setExpense: Dispatch<SetStateAction<Transaction | undefined>>
  categories: Category[]
  setCategories: Dispatch<SetStateAction<Category[]>>
  dialogRef: RefObject<HTMLDialogElement>
  showEditModal: (expense?: Transaction) => void
  closeEditModal: () => void
} | null>(null)

export default function ExpenseProvider({
  children
}: {
  children: ReactNode
}) {
  const [expenses, setExpenses] = useState<Transaction[]>([])
  const [expense, setExpense] = useState<Transaction>()
  const [categories, setCategories] = useState<Category[]>([])
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    async function getData() {
      const expenses = await getExpenses()
      if (Array.isArray(expenses)) {
        setExpenses(expenses)
      }

      if (expenses instanceof Error) {
        alert(expenses.message)
      }
    }
    getData()
  }, [])

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

  function showEditModal(expense?: Transaction) {
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
      expenses,
      setExpenses,
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