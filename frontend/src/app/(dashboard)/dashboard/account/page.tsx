'use client'

import { logout } from '@/lib/form-actions'
import { useUser } from '@/lib/swr'

export default function Account() {
  const { data } = useUser()

  return (
    <>  
      <h1>Account</h1>
      <form action="">
        <label htmlFor="">First Name</label>
        <input
          type="text"
          name="firstName"
          value={data?.firstName}
        />
        <label htmlFor="">Last Name</label>
        <input
          type="text"
          name="lastName"
          value={data?.lastName}
        />
        <label htmlFor="">Email</label>
        <input
          type="email"
          name="email"
          value={data?.email}
        />
      </form>
      <button onClick={async () => {
        await logout()
      }}>Logout</button>
    </>
  )
}