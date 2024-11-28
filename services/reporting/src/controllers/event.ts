import { Event } from '../models/event'
import { EventType, Expense } from '../types'

export async function storeEvent(expense: Expense, type: EventType) {
  const event = new Event({
    aggregateId: expense._id,
    aggregateType: 'expense',
    eventData: expense,
    eventType: type
  })

  await event.save()

  return event
}