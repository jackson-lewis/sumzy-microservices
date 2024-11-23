import { Schema, model } from 'mongoose'

const expenseSchema = new Schema(
  {
    type: {
      type: 'string',
      required: true
    },
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
    },
    frequency: {
      type: 'string'
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