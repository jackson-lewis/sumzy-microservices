import { LoginCredentials } from '@/types'
import { getUserToken } from './actions/user'

type HttpMethods = 'POST' | 'PATCH' | 'DELETE'

export type ApiResponse<T> = {
  data: T | undefined
  error: Error | undefined
  status: Response['status']
}

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
): Promise<ApiResponse<T>>

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
): Promise<ApiResponse<T>>

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
): Promise<ApiResponse<T>>


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
): Promise<ApiResponse<T>>

export async function apiRequest<T>(
  endpoint: string,
  optionsOrMethod?: RequestInit | HttpMethods,
  authOrBody?: boolean | T,
  auth?: boolean
): Promise<ApiResponse<T>> {
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

  const fnReturn: {
    data: T | undefined,
    error: Error | undefined,
    status: number
  } = {
    data: undefined,
    error: undefined,
    status: 0
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
    
    fnReturn.data = json
  } catch (error) {
    if (error instanceof Error) {
      fnReturn.error = error
    }

    fnReturn.error = new Error('Something went wrong')
  }

  return fnReturn
}
