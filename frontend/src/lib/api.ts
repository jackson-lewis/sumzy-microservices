import { LoginCredentials } from '@/types'
import { getUserToken } from './form-actions'

type HttpMethods = 'POST' | 'PATCH' | 'DELETE'


/**
 * Make a POST request to the API gateway.
 * 
 * @param endpoint The API endpoint
 * @param method The HTTP request method
 * @param body The object or array to pass as the request body
 * @param auth Should the request be authenticated
 */
export async function apiRequest<T>(
  endpoint: string,
  method?: HttpMethods,
  body?: T,
  auth?: boolean
): Promise<T | Error>

/**
 * Make a request to the API gateway.
 * 
 * @param endpoint The API endpoint
 * @param options The options to pass to `fetch()`
 * @param auth Should the request be authenticated
 */
export async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit,
  auth?: boolean
): Promise<T | Error>

/**
 * Make a POST request to the API gateway.
 * 
 * @param endpoint The API endpoint
 * @param method The HTTP request method
 * @param body The object or array to pass as the request body
 * @param auth Should the request be authenticated
 */
export async function apiRequest<T>(
  endpoint: string,
  optionsOrMethod?: RequestInit | HttpMethods,
  body?: LoginCredentials,
  auth?: boolean
): Promise<T | Error>


/**
 * Make a POST request to the API gateway.
 * 
 * @param endpoint The API endpoint
 * @param method The HTTP request method
 * @param body The object or array to pass as the request body
 * @param auth Should the request be authenticated
 */
export async function apiRequest<T>(
  endpoint: string,
  optionsOrMethod?: RequestInit | HttpMethods,
  body?: {
    token: string
  },
  auth?: boolean
): Promise<T | Error>

export async function apiRequest<T>(
  endpoint: string,
  optionsOrMethod?: RequestInit | HttpMethods,
  authOrBody?: boolean | T,
  auth?: boolean
): Promise<T | Error> {
  let options: RequestInit = {}

  if (typeof optionsOrMethod === 'string') {
    options.method = optionsOrMethod
    options.body = JSON.stringify(authOrBody)
  } else if (optionsOrMethod) {
    options = optionsOrMethod
  }

  if (authOrBody === true || auth) {
    /**
     * The Authorization header should always 
     * override any existing header.
     */
    options.headers = {
      ...options.headers,
      'Authorization': `Bearer ${await getUserToken()}`
    }
  }

  if (/^(post|patch)$/i.test(options.method || '')) {
    /**
     * The Content-Type header should always be 
     * overridable of any existing header.
     */
    options.headers = {
      'Content-Type': 'application/json',
      ...options.headers
    }
  }

  try {
    const baseUrl = typeof document === 'undefined' ? 
      process.env.API_GATEWAY_URL : 
      process.env.NEXT_PUBLIC_API_GATEWAY_URL
    const res = await fetch(
      `${baseUrl}/${endpoint}`,
      options
    )

    if (res.status >= 500) {
      throw new Error('Something went wrong')
    }
  
    const json = await res.json()
  
    if (res.status >= 400) {
      throw new Error(json.message)
    }
    
    return json
  } catch (error) {
    if (error instanceof Error) {
      return error
    }

    return new Error('Something went wrong')
  }
}
