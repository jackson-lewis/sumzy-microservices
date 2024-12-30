import { apiRequest } from '@/lib/api'
import { Transaction } from '@/types'

jest.mock('../../lib/actions/user', () => {
  return {
    getUserToken: jest.fn(() => {
      return Promise.resolve('token')
    })
  }
})

describe('API requests for transactions', () => {
  it('should return object', async () => {
    const transactions: Transaction[] = [
      {
        id: 1,
        userId: 1,
        amount: 100,
        category: 1,
        frequency: 'one_time',
        description: 'Lunch',
        date: (new Date()).toISOString()
      }
    ]

    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(transactions)
      })
    ) as jest.Mock

    const { data, error } = await apiRequest<Transaction[]>(
      'v1/transactions',
      {},
      true
    )

    expect(data).toEqual(transactions)
    expect(error).toBeUndefined()
  })

  it('should handle server error', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        status: 500
      })
    ) as jest.Mock

    const { data, error } = await apiRequest<Transaction[]>(
      'v1/transactions',
      {},
      true
    )

    expect(data).toBeUndefined()
    expect(error).toBeInstanceOf(Error)
    expect(error).toStrictEqual(new Error('Something went wrong'))
  })

  it('should handle 401', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        status: 401,
        json: () => Promise.resolve({
          message: 'Unauthorized'
        })
      })
    ) as jest.Mock

    const { data, error } = await apiRequest<Transaction[]>(
      'v1/transactions',
      {},
      true
    )

    expect(data).toBeUndefined()
    expect(error).toBeInstanceOf(Error)
    expect(error).toStrictEqual(new Error('Unauthorized'))
  })
})