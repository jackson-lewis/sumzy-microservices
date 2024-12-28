'use server'

import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { apiRequest } from './api'
import { Category, Transaction, TransactionDirection } from '@/types'
import { createTransaction, updateTransaction } from './transactions'
import { addCategory } from './category'


export async function login(prevState: unknown, formData: FormData) {
  const body = Object.fromEntries(formData.entries())
  const cookieStore = await cookies()

  try {
    await apiRequest('v1/users/login', 'POST', body, false)
      .then((data: {
        token: string
        message?: string
      }) => {
        if (data.token) {
          cookieStore.set('token', data.token)
        }
        /**
         * On error, display message
         */
        if (data.message) {
          throw new Error(data.message)
        }
      })
  } catch (error) {
    if (error instanceof Error) {
      return error.message
    }

    return error
  }

  redirect('/dashboard')
}

export async function getUserToken()  {
  const cookieStore = await cookies()

  return cookieStore.get('token')?.value
}

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
  let transaction: Transaction | Error

  if (direction === 'expense') {
    data.amount = data.amount * -1
  }

  if (update === 'true') {
    transaction = await updateTransaction(data)
  } else {
    transaction = await createTransaction(data)
  }

  if (transaction instanceof Error) {
    return {
      message: transaction.message
    }
  }

  return {
    transaction
  }
}

export async function createCategoryAction(
  prevState: unknown,
  formData: FormData
) {
  try {
    const category = await addCategory(
      formData as unknown as Category
    )

    return {
      category
    }
  } catch (error) {
    if (error instanceof Error) {
      return error.message
    }

    return error
  }
}
