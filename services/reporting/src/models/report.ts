import { Schema, model } from 'mongoose'

export interface Report {
  _id: string
  total: number
  categories: {
    [k: string]: any
  }
  userId: string
  date: Date
}

const monthlyReportSchema = new Schema<Report>({
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
  date: {
    type: Date,
    default: Date.now
  }
})

export const Report = model('Report', monthlyReportSchema)