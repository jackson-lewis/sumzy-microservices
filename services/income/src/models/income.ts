import { Schema, model } from 'mongoose'
import { Income as IncomeType } from '../../types'

const incomeSchema = new Schema<IncomeType>(
  {
    userId: {
      type: 'string',
      required: true
    },
    amount: {
      type: 'number',
      required: true
    },
    type: {
      type: 'string',
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    }
  }
)

export const Income = model('Income', incomeSchema)