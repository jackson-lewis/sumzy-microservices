import { TransactionFrequency, Transaction } from '../types'
import { apiRequest } from './api'


/**
 * Retrieve a list of incomes for the authenticated user.
 */
export async function getIncomes(
  type: TransactionFrequency = 'one_time'
): Promise<Transaction[] | Error> {
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
  income: Transaction
): Promise<Transaction | Error> {
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
  income: Transaction
): Promise<Transaction | Error> {
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
  id: Transaction['id']
): Promise<Transaction | Error> {
  return await apiRequest(
    `v1/income?id=${id}`,
    'DELETE',
    null,
    true
  )
}
