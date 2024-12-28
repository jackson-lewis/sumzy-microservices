'use server'

import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { apiRequest } from './api'
import { Transaction, TransactionDirection } from '@/types'
import { createTransaction, updateTransaction } from './transactions'
import { addCategory } from './category'


export async function login(prevState: any, formData: FormData) {
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
  } catch (error: any) {
    return error.message
  }

  redirect('/dashboard')
}

export async function getUserToken()  {
  const cookieStore = await cookies()

  return cookieStore.get('token')?.value
}

export async function transactionAction(
  prevState: any,
  formData: FormData
) {
  const data = Object.fromEntries(formData.entries()) as unknown as Transaction
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
  prevState: any,
  formData: FormData
) {
  try {
    const category = await addCategory(formData)

    return {
      category
    }
  } catch (error: any) {
    return {
      message: error.message
    }
  }
}
