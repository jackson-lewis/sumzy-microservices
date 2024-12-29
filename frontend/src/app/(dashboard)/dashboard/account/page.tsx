'use client'

import { Button } from '@/components/shared/button'
import AccountForm from '@/components/dashboard/account'
import { logout } from '@/lib/form-actions'
import styles from './page.module.scss'

export default function Account() {

  return (
    <>
      <div className={styles.title}>
        <h1>Account</h1>
        <Button
          onClick={async () => {
            await logout()
          }}
        >
          Logout
        </Button>
      </div>
      <AccountForm />
    </>
  )
}