import express from 'express'
import { create } from '../../src/controller'
import { Expense } from '../../src/model'
import request from 'supertest'

jest.mock('../../src/model')

const app = express()
app.use(express.json())
app.post('/', create)

describe('Create recurring expense', () => {
  it('should add recurring expense to MongoDB database and return 201', async () => {
    const mockValue = {
      userId: 'abc123',
      type: 'recurring',
      amount: 500,
      category: 'rent',
      frequency: 'monthly'
    }

    ;(Expense.create as jest.Mock).mockResolvedValue(mockValue)

    const response = await request(app)
      .post('/')
      .set('Content-Type', 'application/json')
      .send(mockValue)

    expect(response.statusCode).toBe(201)
  })

  it('should return 401 with invalid expense type', async () => {
    const mockValue = {
      userId: 'abc123',
      type: 'invalidtype',
      amount: 500,
      category: 'rent'
    }

    ;(Expense.create as jest.Mock).mockResolvedValue(mockValue)

    const response = await request(app)
      .post('/')
      .set('Content-Type', 'application/json')
      .send(mockValue)

    expect(response.statusCode).toBe(401)
    expect(response.body.message).toBe('Expense type invalid')
  })

  it('should return 401 when frequency is not set', async () => {
    const mockValue = {
      userId: 'abc123',
      type: 'recurring',
      amount: 500,
      category: 'rent'
    }

    ;(Expense.create as jest.Mock).mockResolvedValue(mockValue)

    const response = await request(app)
      .post('/')
      .set('Content-Type', 'application/json')
      .send(mockValue)

    expect(response.statusCode).toBe(401)
  })
})