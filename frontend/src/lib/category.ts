import { Category } from '../types'
import { apiRequest } from './api'



/**
 * Delete a category for the authenticated user.
 */
export async function deleteCategory(id: Category['id']) {
  return await apiRequest<Category>(
    `v1/transactions/categories?id=${id}`,
    'DELETE',
    undefined,
    true
  )
}