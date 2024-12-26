import { getUser, logout } from '@/lib/user'
import { User } from '@/types'
import { useEffect, useState } from 'react'

export default function Account() {
  const [user, setUser] = useState<User | null>()

  useEffect(() => {
    async function getData() {
      const user = await getUser()

      if (user instanceof Error) {
        return
      }

      setUser(user)
    }
    getData()
  }, [])

  return (
    <>
        <h1>Account</h1>
        {user ? (
          <>
            <p>{user.firstName} {user.lastName}</p>
            <p>{user.email}</p>
          </>
        ) : (
          <p>Loading...</p>
        )}
        <button onClick={logout}>Log out</button>
    </>      
  )
}
