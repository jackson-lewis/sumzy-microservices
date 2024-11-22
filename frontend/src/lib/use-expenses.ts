import { useContext } from 'react'
import { ExpenseContext } from './expense-context'

export default function useExpenses() {
  const context = useContext(ExpenseContext)

  if (!context) {
    throw new Error('useExpenses must be used within a ExpenseProvider')
  }

  return context
}
