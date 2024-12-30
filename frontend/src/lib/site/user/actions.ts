'use server'

import { apiRequest } from '@/lib/api'
import { redirect } from 'next/navigation'

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
      .then((data) => {
        if (data instanceof Error) {
          throw new Error(data.message)
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