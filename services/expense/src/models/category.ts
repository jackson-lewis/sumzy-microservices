import { Schema, model } from 'mongoose'

const categorySchema = new Schema(
  {
    name: {
      type: 'string',
      required: true,
      unique: true
    },
    type: {
      type: 'string',
      required: true
    },
    userId: {
      type: 'string',
      required: true
    }
  }
)

export const Category = model('Category', categorySchema)