import { Category, Expense, Income, TransactionType } from '../types'
import { apiRequest } from './api'


/**
 * Retrieve a list of expenses for the authenticated user.
 */
export async function getExpenses(type: TransactionType = 'one_time')
: Promise<Expense[] | Error> {
  return await apiRequest(
    `v1/expenses?type=${type}`,
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
    'POST',
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
  id: Expense['id']
): Promise<{ success: boolean } | Error> {
  return await apiRequest(
    `v1/expenses?id=${id}`,
    'DELETE',
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
    return category.id === expense.category
  })
}
