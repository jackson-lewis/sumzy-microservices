import { Schema, model } from 'mongoose'

const expenseSchema = new Schema(
  {
    amount: {
      type: 'number',
      required: true
    },
    category: {
      type: 'string',
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

export const Expense = model('Expense', expenseSchema)

const categorySchema = new Schema(
  {
    name: {
      type: 'string',
      required: true,
      unique: true
    },
    userId: {
      type: 'string',
      required: true
    }
  }
)

export const Category = model('Category', categorySchema)