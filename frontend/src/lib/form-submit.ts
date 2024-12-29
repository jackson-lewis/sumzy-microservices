import { Transaction } from '@/types'
import { useSearchParams } from 'next/navigation'

export function getFormData(form: HTMLFormElement) {
  const data = new FormData(form)
  const formDataEntries: unknown = Object.fromEntries(data.entries())

  return formDataEntries as Transaction
}

export function useActiveYear() {
  const searchParams = useSearchParams()
  const today = new Date()

  return searchParams.get('year') || 
    today.getFullYear().toString()
}

export function useActiveMonth() {
  const searchParams = useSearchParams()
  const today = new Date()

  return searchParams.get('month') || 
    (today.getMonth() + 1).toString()
}
