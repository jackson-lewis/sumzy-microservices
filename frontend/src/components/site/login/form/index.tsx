'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import UserForm, {
  AltActionText,
  ErrorMessage,
  FormField,
  SubmitButton
} from '../../form'
import { login } from '@/lib/form-actions'
import styles from './style.module.scss'


export default function LoginForm() {
  const [message, formAction] = useActionState(login, undefined)
  return (
    <UserForm action={formAction}>
      <h1>Login</h1>
      <ErrorMessage message={message} />
      <FormField
        label="Email"
        name="email"
        type="email"
      />
      <FormField
        label="Password"
        name="password"
        type="password"
        autoComplete="current-password"
      />
      <SubmitButton>Login</SubmitButton>
      <AltActionText>
        Don&apos;t have an account? <Link href="/signup">Sign up now</Link>
      </AltActionText>
    </UserForm>
  )
}