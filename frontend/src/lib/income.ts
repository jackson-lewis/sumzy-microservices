import { TransactionType, Income } from '../types'
import { apiRequest } from './api'


/**
 * Retrieve a list of incomes for the authenticated user.
 */
export async function getIncomes(type: TransactionType = 'one_time')
: Promise<Income[] | Error> {
  return await apiRequest(
    `v1/income?type=${type}`,
    {},
    true
  )
}


/**
 * Add an income for the authenticated user.
 */
export async function createIncome(
  income: Income
): Promise<Income | Error> {
  return await apiRequest(
    'v1/income',
    'POST',
    income,
    true
  )
}


/**
 * Update a income for the authenticated user.
 */
export async function updateIncome(
  income: Income
): Promise<{ success: boolean } | Error> {
  return await apiRequest(
    'v1/income',
    'PATCH',
    income,
    true
  )
}


/**
 * Delete an income for the authenticated user.
 */
export async function deleteIncome(
  id: Income['id']
): Promise<{ success: boolean } | Error> {
  return await apiRequest(
    `v1/income?id=${id}`,
    'DELETE',
    null,
    true
  )
}
