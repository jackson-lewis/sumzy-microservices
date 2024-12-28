'use client'

import Form from 'next/form'
import Link from 'next/link'
import { Button } from '@/components/shared/button'
import styles from './style.module.scss'
import { login } from '@/lib/form-actions'
import { useActionState } from 'react'


export default function LoginForm() {
  const [message, formAction, pending] = useActionState(login, null)
  return (
    <div className={styles.wrapper}>
      <Form action={formAction} className={styles.form}>
        <h1>Login</h1>
        {!!message ? (
          <p
            aria-live="polite"
            className={styles.error}
          >
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#bd2f00"><path d="M480-280q17 0 28.5-11.5T520-320q0-17-11.5-28.5T480-360q-17 0-28.5 11.5T440-320q0 17 11.5 28.5T480-280Zm0-160q17 0 28.5-11.5T520-480v-160q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640v160q0 17 11.5 28.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>
            <span>{message}</span>
          </p>
        ) : null}
        <div className={styles.field}>
          <label htmlFor="email">Email</label>
          <input type="email" name="email" required />
        </div>
        <div className={styles.field}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            required
            autoComplete="current-password"
          />
        </div>
        <Button
          style="fill"
          color="green"
          className={styles.submit}
          disabled={pending}
        >
          Login
        </Button>
        <p className={styles.signup}>Don't have an account? <Link href="/signup">Sign up now</Link></p>
      </Form>
    </div>
  )
}