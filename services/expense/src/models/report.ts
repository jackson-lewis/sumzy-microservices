import { Schema, model } from 'mongoose'

const monthlyReportSchema = new Schema(
  {
    _id: {
      type: 'string',
      required: true
    },
    total: {
      type: 'number',
      required: true
    },
    categories: {
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
    userId: {
      type: 'string',
      required: true
    },
    year: {
      type: 'number',
      required: true
    },
    month: {
      type: 'number',
      required: true
    }
  }
)

export const Report = model('Report', monthlyReportSchema)