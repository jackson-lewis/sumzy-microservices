import express from 'express'
import { createCategory } from '../../src/category'
import { Category } from '../../src/model'
import request from 'supertest'

jest.mock('../../src/model')

const app = express()
app.use(express.json())
app.post('/categories', createCategory)

describe('Create category', () => {
  it('should add category to MongoDB database and return 201', async () => {
    const mockValue = {
      userId: 'abc123',
      name: 'Food'
    }

    ;(Category.create as jest.Mock).mockResolvedValue(mockValue)

    const response = await request(app)
      .post('/categories')
      .set('Content-Type', 'application/json')
      .send(mockValue)

    expect(response.statusCode).toBe(201)
  })
})