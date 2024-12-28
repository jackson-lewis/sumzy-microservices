import { getUserToken } from '@/lib/swr'

describe('Get user token from cookies', () => {
  it('should be available', async () => {
    const token = 'jwttoken'
    document.cookie = `token=jwttoken;max-age=60;secure`
    
    const _token = getUserToken()

    expect(_token).toBe(token)
  })
})
