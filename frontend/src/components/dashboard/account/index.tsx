import { Button } from '@/components/shared/button'
import { updateUserAction } from '@/lib/form-actions'
import { useUser } from '@/lib/swr'
import Form from 'next/form'
import { useActionState } from 'react'
import styles from './style.module.scss'
import { ErrorMessage } from '@/components/site/form'

export default function AccountForm() {
  const { data } = useUser()
  const [message, formAction, pending] = useActionState(updateUserAction, null)

  return (
    <Form action={formAction} className={styles.form}>
      <ErrorMessage message={message} />
      <FormField
        label="Name"
        name="name"
        type="text"
        defaultValue={data?.name}
      />
      <FormField
        label="Email"
        name="email"
        type="email"
        defaultValue={data?.email}
      />
      <Button
        disabled={pending}
        style="fill"
        color="green"
      >
        Save
      </Button>
    </Form>
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
