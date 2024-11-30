import { Schema, model } from 'mongoose'
import { AggregateType, Event as EventType } from '../types'


const eventSchema = new Schema<EventType<AggregateType>>(
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