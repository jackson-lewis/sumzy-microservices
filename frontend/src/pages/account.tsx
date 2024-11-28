import { logout } from '@/lib/user'

export default function Account() {
  return (
    <>
        <h1>Account</h1>
        <button onClick={logout}>Log out</button>
    </>      
  )
}
