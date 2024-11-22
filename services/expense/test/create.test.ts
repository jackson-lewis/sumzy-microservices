import express from 'express'
import { create } from '../src/controller'
import { Expense } from '../src/model'
import request from 'supertest'

jest.mock('../src/model')

const app = express()
app.use(express.json())
app.post('/', create)

describe('Create expense', () => {
  it('should add expense to MongoDB database and return 201', async () => {
    const mockValue = {
      userId: 'abc123',
      amount: 1,
      category: 'food'
    }

    ;(Expense.create as jest.Mock).mockResolvedValue(mockValue)

    const response = await request(app)
      .post('/')
      .set('Content-Type', 'application/json')
      .send(mockValue)

    expect(response.statusCode).toBe(201)
  })
})