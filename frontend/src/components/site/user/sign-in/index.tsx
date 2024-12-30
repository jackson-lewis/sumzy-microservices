'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import {
  UserForm,
  AltActionText,
  Message,
  FormField,
  SubmitButton
} from '../form'
import { login } from '@/lib/form-actions'


export default function SignInForm() {
  const [message, formAction] = useActionState(login, undefined)
  return (
    <UserForm action={formAction}>
      <h1>Sign in</h1>
      <Message message={message} />
      <FormField
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        required
      />
      <FormField
        label="Password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
      />
      <SubmitButton>Login</SubmitButton>
      <AltActionText>
        Don&apos;t have an account? <Link href="/sign-up">Sign up now</Link>
      </AltActionText>
    </UserForm>
  )
}