'use client'

import { useActionState, useEffect, useState } from 'react'
import UserForm, {
  AltActionText,
  ErrorMessage, 
  FormField, 
  SubmitButton 
} from '../../form'
import { register } from '@/lib/form-actions'
import { validatePassword } from '@/lib/user'
import styles from './style.module.scss'
import Link from 'next/link'

export default function SignUpForm() {
  const [message, formAction, pending] = useActionState(register, null)
  const [allowRegister, setAllowRegister] = useState(false)
  const [password, setPassword] = useState('')
  const [passwordC, setPasswordC] = useState('')
  const [validations, setValidations] = useState<{
    [k: string]: boolean
  }>({})

  useEffect(() => {
    const validated = validatePassword(password)
    setValidations(validated)

    const passAllChecks = Object.values(validated)
      .every((check) => {
        return check === true
      })

    setAllowRegister(passAllChecks)
  }, [password])

  useEffect(() => {
    setAllowRegister(password === passwordC)
  }, [password, passwordC])

  return (
    <UserForm action={formAction}>
      <h1>Sign Up</h1>
      <ErrorMessage message={message} />
      <FormField
        label="Name"
        name="name"
        type="text"
        autoComplete="name"
        required
      />
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
        autoComplete="new-password"
        required
        value={password}
        onChange={(event) => {
          setPassword(event.target.value)
        }}
      />
      <ul className={styles.passwordValidations}>
        <PasswordValidationLine
          label="8 characters or more"
          pass={validations.length}
        />
        <PasswordValidationLine
          label="Uppercase"
          pass={validations.upper}
        />
        <PasswordValidationLine
          label="Number"
          pass={validations.number}
        />
        <PasswordValidationLine
          label="Special character (e.g. !?<>@#$%)"
          pass={validations.special}
        />
      </ul>
      <FormField
        label="Confirm password"
        name="password_confirm"
        type="password"
        autoComplete="new-password"
        required
        value={passwordC}
        onChange={(event) => {
          setPasswordC(event.target.value)
        }}
      />
      <SubmitButton
        disabled={!allowRegister || pending}
      >
        Sign up
      </SubmitButton>
      <AltActionText>
        Have an account? <Link href="/sign-in">Sign in now</Link>
      </AltActionText>
    </UserForm>
  )
}

function PasswordValidationLine({
  label,
  pass = false
}: {
  label: string
  pass?: boolean
}) {
  return (
    <li>
      {pass ? (
        <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill="#00bc13"><path d="m424-408-86-86q-11-11-28-11t-28 11q-11 11-11 28t11 28l114 114q12 12 28 12t28-12l226-226q11-11 11-28t-11-28q-11-11-28-11t-28 11L424-408Zm56 328q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill="#bd2f00"><path d="M480-280q17 0 28.5-11.5T520-320q0-17-11.5-28.5T480-360q-17 0-28.5 11.5T440-320q0 17 11.5 28.5T480-280Zm0-160q17 0 28.5-11.5T520-480v-160q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640v160q0 17 11.5 28.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>
      )}
      <span>{label}</span>
    </li>
  )
}