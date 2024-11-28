import { Schema, model } from 'mongoose'
import { Expense } from '../types'

export interface Event {
  aggregateId: string
  aggregateType: 'expense'
  eventData: Expense
  eventType: 'created' | 'updated' | 'deleted'
  createdAt: Date
  version: number
}

const eventSchema = new Schema<Event>(
  {
    aggregateId: {
      type: 'string',
      required: true
    },
    aggregateType: {
      type: 'string',
      required: true
    },
    eventData: {
      type: Schema.Types.Mixed,
      required: true
    },
    eventType: {
      type: 'string',
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    version: {
      type: 'number',
      default: 1
    }
  }
)

export const Event = model('Event', eventSchema)