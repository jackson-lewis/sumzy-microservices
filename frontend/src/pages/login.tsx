import { login, register, validatePassword } from '@/lib/user'
import { useEffect, useState } from 'react'

export default function Login() {
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
    <div>
      <h1>Login</h1>
      <form onSubmit={login}>
        <input type="email" name="email" required />
        <input type="password" name="password" required />
        <button>Log in</button>
      </form>

      <h2>Register</h2>
      <form onSubmit={register}>
        <div>
          <label htmlFor="first_name">First name</label>
          <br />
          <input type="text" name="firstName" id="first_name" required />
        </div>
        <input type="text" name="lastName" required />
        <input type="email" name="email" required />
        <input
          type="password"
          name="password"
          required
          value={password}
          onChange={(event) => {
            setPassword(event.target.value)
          }}
        />
        <ul>
          <li>Length of 8 characters or more {validations.length ? 'Y' : 'N'}</li>
          <li>Contains uppercase {validations.upper ? 'Y' : 'N'}</li>
          <li>Contains number {validations.number ? 'Y' : 'N'}</li>
          <li>Contains special character {validations.special ? 'Y' : 'N'}</li>
        </ul>
        <input
          type="password"
          name="password_confirm"
          required
          value={passwordC}
          onChange={(event) => {
            setPasswordC(event.target.value)
          }}
        />
        <button disabled={!allowRegister}>Sign up</button>
      </form>
    </div>
  )
}