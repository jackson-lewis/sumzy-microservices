'use server'

import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { apiRequest } from '@/lib/api'
import {
  LoginCredentials,
  User,
  UserToken 
} from '@/types'



export async function signIn(prevState: unknown, formData: FormData) {
  const body = Object.fromEntries(formData.entries()) as LoginCredentials
  const cookieStore = await cookies()

  const { data, error } = await apiRequest<UserToken>(
    'v1/users/login',
    'POST',
    body,
    false
  )

  if (data) {
    cookieStore.set('token', data.token)
  }

  if (error) {
    return error.message
  }

  redirect('/dashboard?action=sign-in')
}


export async function signUp(
  prevState: unknown,
  formData: FormData
) {
  const body = Object.fromEntries(
    formData.entries()
  ) as Omit<User, 'id'>

  const { error } = await apiRequest('v1/users', 'POST', body, false)

  if (error) {
    return error
  }

  redirect('/sign-up/verify-email')
}


export async function signOut() {
  const cookieStore = await cookies()
  cookieStore.delete('token')

  redirect('/sign-in?action=sign-out')
}


export async function getUserToken()  {
  const cookieStore = await cookies()

  return cookieStore.get('token')?.value
}


export async function updateUser(
  prevState: unknown,
  formData: FormData
) {
  const body = Object.fromEntries(
    formData.entries()
  ) as Omit<User, 'id'>

  const { error } = await apiRequest('v1/users', 'PATCH', body, true)

  if (error)  {
    return error
  }
}


export async function verifyEmailToken(token: string): Promise<string | void> {
  const cookieStore = await cookies()

  const { data, error } = await apiRequest<{ signInToken: string }>(
    'v1/users/verify-email-token',
    'POST',
    { token },
    false
  )
  
  if (error) {
    return error.message
  }

  if (data) {
    cookieStore.set('token', data.signInToken)
    redirect('/dashboard?action=welcome')
  }
}


export async function forgotPassword(
  prevState: unknown,
  formData: FormData
) {
  try {
    return await apiRequest(
      'v1/users/forgot-password',
      'POST',
      Object.fromEntries(formData.entries()),
      false
    )
      .then(({ error }) => {
        if (error) {
          throw error
        }

        return 'A reset password link has been sent to your email'
      })
  } catch (error) {
    if (error instanceof Error) {
      return error.message
    }

    return 'An error occurred while sending a reset passord link'
  }
}


export async function resetPassword(
  prevState: unknown,
  formData: FormData
) {
  try {
    console.log('in resetPassword')

    await apiRequest(
      'v1/users/reset-password',
      'POST',
      Object.fromEntries(formData.entries()),
      false
    )
      .then((data) => {
        console.log({ data })
        if (data instanceof Error) {
          throw new Error(data.message)
        }
      })
  } catch (error) {

    console.log('in catch')
    if (error instanceof Error) {
      return error.message
    }

    return 'An error occurred while resetting your email'
  }

  console.log('redirect?')
  redirect('/sign-in?action=reset-password')
}