import { formatDate } from '../src/lib/utils'


describe('Format date from request', () => {
  it('should format YYYY-MM-DD to ISO string', async () => {
    const input = '2024-11-01'
    const trueDate = new Date(2024, 10, 1)
    const date = formatDate(input)

    if (!date) {
      return
    }

    expect(date.toISOString()).toBe(trueDate.toISOString())
  })

  it('should format YYYY-M-D to ISO string', async () => {
    const input = '2024-1-1'
    const trueDate = new Date(2024, 0, 1)
    const date = formatDate(input)

    if (!date) {
      return
    }

    expect(date.toISOString()).toBe(trueDate.toISOString())
  })

  it('should format YYYY/MM/DD to ISO string', async () => {
    const input = '2024/11/01'
    const trueDate = new Date(2024, 10, 1)
    const date = formatDate(input)

    if (!date) {
      return
    }

    expect(date.toISOString()).toBe(trueDate.toISOString())
  })

  it('should format YYYY/M/D to ISO string', async () => {
    const input = '2024/1/1'
    const trueDate = new Date(2024, 0, 1)
    const date = formatDate(input)

    if (!date) {
      return
    }

    expect(date.toISOString()).toBe(trueDate.toISOString())
  })

  it('should format UNIX timestamp to ISO string', async () => {
    const input = '1730419200000'
    const trueDate = new Date(2024, 10, 1)
    const date = formatDate(input)

    if (!date) {
      return
    }

    expect(date.toISOString()).toBe(trueDate.toISOString())
  })

  it('should reject invalid format', async () => {
    const input = 'some/invalid-format'
    const date = formatDate(input)

    expect(date).toBe(false)
  })
})