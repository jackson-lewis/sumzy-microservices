import { Category, Expense } from '../types'
import { apiRequest } from './api'


/**
 * Retrieve a list of expenses for the authenticated user.
 */
export async function getExpenses()
: Promise<Expense[] | Error> {
  return await apiRequest(
    'v1/expenses',
    {},
    true
  )
}


/**
 * Add a expense for the authenticated user.
 */
export async function addExpense(
  expense: Expense
): Promise<Expense | Error> {
  return await apiRequest(
    'v1/expenses',
    'post',
    expense,
    true
  )
}


/**
 * Update a expense for the authenticated user.
 */
export async function updateExpense(
  expense: Expense
): Promise<{ success: boolean } | Error> {
  return await apiRequest(
    'v1/expenses',
    'PATCH',
    expense,
    true
  )
}


/**
 * Delete an expense for the authenticated user.
 */
export async function deleteExpense(
  id: Expense['_id']
): Promise<{ success: boolean } | Error> {
  return await apiRequest(
    `v1/expenses?id=${id}`,
    'delete',
    null,
    true
  )
}


/**
 * Get the category for the expense
 */
export function getExpenseCategory(
  expense: Expense,
  categories: Category[]
) {
  return categories.find((category) => {
    return category._id === expense.category
  })
}
