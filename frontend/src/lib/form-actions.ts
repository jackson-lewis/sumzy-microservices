'use server'

import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { apiRequest } from './api'
import {
  Category,
  LoginCredentials,
  Transaction,
  TransactionDirection,
  User,
  UserToken 
} from '@/types'
import {
  createTransaction,
  updateTransaction
} from './transactions'
import { addCategory } from './category'


export async function login(prevState: unknown, formData: FormData) {
  const body = Object.fromEntries(formData.entries()) as LoginCredentials
  const cookieStore = await cookies()

  try {
    await apiRequest<UserToken>('v1/users/login', 'POST', body, false)
      .then((data) => {
        if (data instanceof Error) {
          throw new Error(data.message)
        }

        cookieStore.set('token', data.token)
      })
  } catch (error) {
    if (error instanceof Error) {
      return error.message
    }

    return error
  }

  redirect('/dashboard')
}

export async function register(
  prevState: unknown,
  formData: FormData
) {
  const body = Object.fromEntries(
    formData.entries()
  ) as Omit<User, 'id'>


  try {
    await apiRequest('v1/users', 'POST', body, false)
  } catch (error) {
    if (error instanceof Error) {
      return error.message
    }

    return error
  }

  redirect('/sign-up/verify')
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete('token')

  redirect('/sign-in')
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

export async function updateUserAction(
  prevState: unknown,
  formData: FormData
) {
  const body = Object.fromEntries(
    formData.entries()
  ) as Omit<User, 'id'>

  try {
    await apiRequest('v1/users', 'PATCH', body, true)
  } catch (error) {
    if (error instanceof Error) {
      return error.message
    }

    return error
  }
}

export async function verifyEmailToken(token: string): Promise<string | void> {
  const cookieStore = await cookies()

  try {
    await apiRequest<{ signInToken: string }>(
      'v1/users/verify-email-token',
      'POST',
      { token },
      false
    )
      .then((data) => {
        if (data instanceof Error) {
          throw data
        }

        cookieStore.set('token', data.signInToken)
      })
  } catch (error) {
    if (error instanceof Error) {
      return error.message
    }

    return 'An error occurred while verifying your email'
  }

  redirect('/dashboard')
}