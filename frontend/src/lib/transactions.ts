import { Category, Transaction, TransactionDirection } from '@/types'
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


/**
 * Update a transaction for the authenticated user.
 */
export async function updateTransaction(
  transaction: Transaction
): Promise<Transaction | Error> {
  return await apiRequest(
    'v1/transactions',
    'PATCH',
    transaction,
    true
  )
}


/**
 * Delete a transaction for the authenticated user.
 */
export async function deleteTransaction(
  id: Transaction['id']
): Promise<Transaction | Error> {
  return await apiRequest(
    `v1/transactions?id=${id}`,
    'DELETE',
    null,
    true
  )
}

export function txDirection(
  transaction: Transaction
): TransactionDirection {
  return transaction.amount < 0 ? 'expense' : 'income'
}

/**
 * Get the category for the transaction
 */
export function getTransactionCategory(
  transaction: Transaction,
  categories: Category[] | undefined
): Category | undefined {
  if (!categories) {
    return null
  }

  return categories.find((category) => {
    return category.id === transaction.category
  })
}
