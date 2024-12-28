'use client'

import { useActionState, useEffect } from 'react'
import Form from 'next/form'
import { createCategoryAction } from '@/lib/form-actions'

export default function AddCategory() {
  const [state, formAction, pending] = useActionState(
    createCategoryAction,
    null
  )

  useEffect(() => {
    console.log({ state })
  }, [state])

  return (
    <Form action={formAction}>
      <label htmlFor="name">Name</label>
      <input type="text" name="name" id="name" required />
      <button disabled={pending}>Add</button>
    </Form>
  )
}
