'use server'

import { apiRequest } from '../api'
import { Transaction, TransactionDirection } from '@/types'

export async function transactionAction(
  prevState: unknown,
  formData: FormData
) {
  const data = Object.fromEntries(
    formData.entries()
  ) as unknown as Transaction
  const direction = 
    formData.get('direction') as TransactionDirection
  const update = formData.get('update')

  if (direction === 'expense') {
    data.amount = data.amount * -1
  }

  const response =  await apiRequest<Transaction>(
    'v1/transactions',
    update === 'true' ? 'PATCH' : 'POST',
    data,
    true
  )

  if (response.error) {
    return response.error
  }

  return {
    transaction: response.data
  }
}