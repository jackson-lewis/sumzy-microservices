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
export async function apiRequest(
  endpoint: string,
  method?: HttpMethods,
  body?: any,
  auth?: boolean
): Promise<
  any |
  Error
>

/**
 * Make a request to the API gateway.
 * 
 * @param endpoint The API endpoint
 * @param options The options to pass to `fetch()`
 * @param auth Should the request be authenticated
 */
export async function apiRequest(
  endpoint: string,
  options?: RequestInit,
  auth?: boolean
): Promise<
  any |
  Error
>


export async function apiRequest(
  endpoint: string,
  optionsOrMethod?: RequestInit | HttpMethods,
  authOrBody?: any,
  auth?: boolean
): Promise<
  any | 
  Error
> {
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
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/${endpoint}`, options)

    if (res.status >= 500) {
      return new Error('Something went wrong')
    }
  
    const json = res.json()
  
    if (res.status >= 400) {
      return json.then((data) => {
        return new Error(data.message)
      })
    }
    
    return json
  } catch (error: any) {
    return new Error(JSON.stringify(error))
  }
}
