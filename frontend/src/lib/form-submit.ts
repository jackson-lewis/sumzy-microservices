import { Transaction } from '@/types'

export function getFormData(form: HTMLFormElement) {
  const data = new FormData(form)
  const formDataEntries: unknown = Object.fromEntries(data.entries())

  return formDataEntries as Transaction
}
