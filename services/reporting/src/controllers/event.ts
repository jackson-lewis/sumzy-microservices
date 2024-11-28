import { Event } from '../models/event'
import { Expense } from '../types'

export async function storeEvent(expense: Expense) {
  const event = new Event({
    aggregateId: expense._id,
    aggregateType: 'expense',
    eventData: expense,
    eventType: 'created'
  })

  await event.save()

  return event
}