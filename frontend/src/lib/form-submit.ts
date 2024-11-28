import { Expense } from '@/types'

export function getFormDataAsExpense(form: HTMLFormElement) {
  const data = new FormData(form)
  const formDataEntries: unknown = Object.fromEntries(data.entries())
  return formDataEntries as Expense
}
