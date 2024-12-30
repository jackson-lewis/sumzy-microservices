'use client'

import { useActionState, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import {
  UserForm,
  AltActionText,
  Message,
  NewPasswordField,
  SubmitButton,
  Container
} from '../form'
import { login } from '@/lib/form-actions'


export default function ResetPasswordForm() {
  const [message, formAction, pending] = useActionState(login, undefined)
  const [disableSubmit, setDisableSubmit] = useState(true)
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  if (!token) {
    return (
      <Container>
        <h1>Reset your password</h1>
        <Message message="Invalid reset token" />
        <AltActionText>
          <Link href="/sign-in/forgot-password">Send new reset link</Link>
        </AltActionText>
      </Container>
    )
  }

  return (
    <UserForm action={formAction}>
      <h1>Reset your password</h1>
      <Message message={message} />
      <NewPasswordField
        setDisableSubmit={setDisableSubmit}
      />
      <SubmitButton
        disabled={disableSubmit || pending}
      >
        Reset Password
      </SubmitButton>
      <AltActionText>
        Already have an account? <Link href="/sign-in">Sign in now</Link>
      </AltActionText>
    </UserForm>
  )
}