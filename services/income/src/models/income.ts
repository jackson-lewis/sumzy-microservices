import { Schema, model } from 'mongoose'
import { Income as IncomeType } from '../../types'

const incomeSchema = new Schema<IncomeType>(
  {
    amount: {
      type: 'number',
      required: true
    },
    userId: {
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