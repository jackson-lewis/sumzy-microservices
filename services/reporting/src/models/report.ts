import { Schema, model } from 'mongoose'


const monthlyReportSchema = new Schema({
  totals: {
    type: 'object',
    required: true,
    properties: {
      income: {
        type: 'number',
        required: true
      },
      expense: {
        type: 'number',
        required: true
      },
      expenseCategories: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            required: true
          },
          total: {
            type: 'number',
            required: true
          }
        }
      },
    }
  },
  userId: {
    type: 'string',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
})

export const Report = model('Report', monthlyReportSchema)