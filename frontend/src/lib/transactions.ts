import { Transaction } from '@/types'
import { apiRequest } from './api'

/**
 * Retrieve a list of transactions for the authenticated user.
 */
export async function getTransactions()
: Promise<Transaction[] | Error> {
  return await apiRequest(
    'v1/transactions',
    {},
    true
  )
}


/**
 * Add a transaction for the authenticated user.
 */
export async function createTransaction(
  transaction: Transaction
): Promise<Transaction | Error> {
  return await apiRequest(
    'v1/transactions',
    'POST',
    transaction,
    true
  )
}
