import { Category } from '../types'
import { apiRequest } from './api'


/**
 * Retrieve a list of categories for the authenticated user.
 */
export async function getCategories() {
  return await apiRequest<Category[]>(
    'v1/transactions/categories',
    {},
    true
  )
}


/**
 * Add a category for the authenticated user.
 */
export async function addCategory(category: Category) {
  return await apiRequest(
    'v1/transactions/categories',
    'POST',
    category,
    true
  )
}


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