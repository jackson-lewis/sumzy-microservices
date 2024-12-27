import { User } from '@/types'
import { apiRequest } from './api'

export async function register(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault()

  const data = new FormData(event.target as HTMLFormElement)
  const body = Object.fromEntries(data.entries())

  await apiRequest('v1/users', 'POST', body, false)
}


export async function login(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault()

  const data = new FormData(event.target as HTMLFormElement)
  const body = Object.fromEntries(data.entries())

  await apiRequest('v1/users/login', 'POST', body, false)
    .then((data: {
      token: string
      message?: string
    }) => {
      if (data.token) {
        document.cookie = `token=${data.token};max-age=86400;secure`
        console.log('Log in successful.')
      }
      /**
       * On error, display message
       */
      if (data.message) {
        alert(data.message)
      }
    })
}

export function logout() {
  document.cookie = 'token=; max-age=0'
}

export function getUserToken()  {
  let token = ''
  const cookies = document.cookie.split(';')

  cookies.forEach((cookie) => {
    const [name, value] = cookie.split('=')

    if (name.trim() === 'token') {
      token = value.trim()
    }
  })

  return token
}

export function isUserLoggedIn() {
  return !!getUserToken()
}

export async function getUser(): Promise<User | Error> {
  return await apiRequest(
    'v1/users',
    {},
    true
  )
}

export function validatePassword(pwd: string) {
  return {
    length: pwdLength(pwd),
    upper: pwdContainsUppercase(pwd),
    number: pwdContainsNumber(pwd),
    special: pwdContainsSpecialChar(pwd)
  }
}

export function pwdLength(pwd: string) {
  return pwd.length >= 10
}

export function pwdContainsUppercase(pwd: string) {
  return /[A-Z]+/.test(pwd)
}

export function pwdContainsNumber(pwd: string) {
  return /[0-9]+/.test(pwd)
}

export function pwdContainsSpecialChar(pwd: string) {
  return /[^a-zA-Z0-9]+/.test(pwd)
}