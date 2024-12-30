import { forgotPassword } from '@/lib/site/user/actions'


describe('Forgot password', () => {
  it('should return success message when request is successful', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ success: true })
      })
    ) as jest.Mock

    const data = new FormData()
    data.append('email', 'jackson@sumzy.money')

    const message = await forgotPassword(undefined, data)
    const successMessage = 'A reset password link has been sent to your email'

    expect(message).toBe(successMessage)
  })

  it('should return error message when request failed', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(new Error('An error occurred'))
      })
    ) as jest.Mock

    const data = new FormData()
    data.append('email', 'jackson@sumzy.money')

    const message = await forgotPassword(undefined, data)
    const errorMessage = 'An error occurred'

    expect(message).toBe(errorMessage)
  })
})