import { Expense, Income } from '@/types'

export function getFormDataAs<T extends 'expense' | 'income'>(
  form: HTMLFormElement,
  type: T
): T extends 'expense' ? Expense : Income {
  const data = new FormData(form)
  const formDataEntries: unknown = Object.fromEntries(data.entries())

  if (type === 'expense') {
    return formDataEntries as Expense
  }

  return formDataEntries as Income
}
