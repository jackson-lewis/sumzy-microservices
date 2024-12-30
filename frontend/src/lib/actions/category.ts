'use server'

import { Category } from '@/types'
import { apiRequest } from '../api'

export async function createCategory(
  prevState: unknown,
  formData: FormData
) {
  return await apiRequest<Category>(
    'v1/transactions/categories',
    'POST',
    formData as unknown as Category,
    true
  )
}