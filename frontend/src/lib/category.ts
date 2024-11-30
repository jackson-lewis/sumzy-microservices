import { Category } from '../types'
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
  category: Category
): Promise<Category | Error> {
  return await apiRequest(
    'v1/expenses/categories',
    'POST',
    category,
    true
  )
}


/**
 * Delete a category for the authenticated user.
 */
export async function deleteCategory(
  id: Category['_id']
): Promise<{ success: boolean } | Error> {
  return await apiRequest(
    `v1/expenses/categories?id=${id}`,
    'DELETE',
    null,
    true
  )
}