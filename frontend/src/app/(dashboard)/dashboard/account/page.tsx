'use client'

import { fetcherWithToken, getUserToken } from '@/lib/swr'
import { User } from '@/types'
import useSWR from 'swr'

export default function Account() {
  const { data } = useSWR<User>(
    ['/v1/users', getUserToken()],
    fetcherWithToken
  )

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
    </>
  )
}