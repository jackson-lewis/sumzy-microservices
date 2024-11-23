import { Category, Expense, ExpenseType } from '../types'
import { apiRequest } from './api'


/**
 * Retrieve a list of expenses for the authenticated user.
 */
export async function getExpenses(type: ExpenseType = 'one_time')
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

export function sortExpensesByDate(a: Expense, b: Expense) {
  if (a.date > b.date) {
    return -1
  }

  if (a.date < b.date) {
    return 1
  }

  return 0
}
