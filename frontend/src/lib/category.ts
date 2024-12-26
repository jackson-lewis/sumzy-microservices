import { Category, TransactionDirection } from '../types'
import { apiRequest } from './api'


/**
 * Retrieve a list of categories for the authenticated user.
 */
export async function getCategories()
: Promise<Category[] | Error> {
  return await apiRequest(
    'v1/expenses/categories',
    {},
    true
  )
}


/**
 * Add a category for the authenticated user.
 */
export async function addCategory(
  category: Category,
  direction: TransactionDirection
): Promise<Category | Error> {
  return await apiRequest(
    `v1/${direction === 'expense' ? 'expenses' : 'income'}/categories`,
    'POST',
    category,
    true
  )
}


/**
 * Delete a category for the authenticated user.
 */
export async function deleteCategory(
  id: Category['id']
): Promise<{ success: boolean } | Error> {
  return await apiRequest(
    `v1/expenses/categories?id=${id}`,
    'DELETE',
    null,
    true
  )
}