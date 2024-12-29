import { useFormStatus } from 'react-dom'
import Form from 'next/form'
import { Button, ButtonProps } from '@/components/shared/button'
import styles from './style.module.scss'
import Link from 'next/link'

export default function UserForm({
  action,
  children
}: {
  action: (payload: FormData) => void
  children: React.ReactNode
}) {
  return (
    <div className={styles.wrapper}>
      <Form action={action} className={styles.form}>
        {children}
      </Form>
    </div>
  )
}

export function FormField({
  label,
  name,
  type,
  ...rest
}: {
  label: string
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={styles.field}>
      <label htmlFor={name}>{label}</label>
      {(name === 'password' && rest.autoComplete === 'current-password') && (
        <Link
          href="/sign-in/forgot-password"
          className={styles.forgotPassword}
        >
          Forgot password?
        </Link>
      )}
      <input
        type={type}
        name={name}
        id={name}
        required
        {...rest}
      />
    </div>
  )
}

export function SubmitButton({
  children,
  ...rest
}: ButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { pending } = useFormStatus()

  return (
    <Button
      style="fill"
      color="green"
      className={styles.submit}
      disabled={pending}
      {...rest}
    >
      {children}
    </Button>
  )
}

export function ErrorMessage({
  message
}: {
  message: unknown
}) {
  if (typeof message !== 'string') {
    return null
  }

  return (
    <p
      aria-live="polite"
      className={styles.error}
    >
      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#bd2f00"><path d="M480-280q17 0 28.5-11.5T520-320q0-17-11.5-28.5T480-360q-17 0-28.5 11.5T440-320q0 17 11.5 28.5T480-280Zm0-160q17 0 28.5-11.5T520-480v-160q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640v160q0 17 11.5 28.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>
      <span>{message}</span>
    </p>
  )
}

export function AltActionText({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <p className={styles.altActionText}>{children}</p>
  )
}