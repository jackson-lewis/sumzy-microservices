import { login, register } from '@/lib/user'

export default function Login() {
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
        <input type="password" name="password" required />
        <button>Sign up</button>
      </form>
    </div>
  )
}