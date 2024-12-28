'use client'

import { Category, Report, Transaction } from '@/types'
import { usePathname, useSearchParams } from 'next/navigation'
import useSWR from 'swr'

export const fetcher = async (url: string) => {
  return fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}${url}`)
    .then(r => r.json())
}

export async function fetcherWithToken(key: [string, string]) {
  const options: RequestInit = {}

  options.headers = {
    ...options.headers,
    'Authorization': `Bearer ${key[1]}`
  }

  return fetch(
    `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}${key[0]}`,
    options
  )
    .then(r => r.json())
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

export function useTx() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const frequency = searchParams.get('frequency') || 'one_time'
  const direction = pathname
    .replace('/dashboard/', '')
    .replace(/s$/, '')

  return useSWR<Transaction[]>(
    [
      `/v1/transactions?direction=${direction}&frequency=${frequency}`,
      getUserToken()
    ],
    fetcherWithToken
  )
}

export function useCategories() {
  return useSWR<Omit<Category, 'amount'>[]>(
    ['/v1/transactions/categories', getUserToken()],
    fetcherWithToken
  )
}

export function useReports() {
  const searchParams = useSearchParams()
  const year = searchParams.get('year')
  const month = searchParams.get('month')

  return useSWR<Report>(
    [`/v1/reporting/${year}/${month}`, getUserToken()],
    fetcherWithToken
  )
}
