import { Event } from '../models/event'
import { AggregateType, EventType, Expense, Income } from '../types'

export async function storeEvent<T extends Expense | Income>(
  eventData: T,
  aggregateType: AggregateType,
  type: EventType
) {
  const event = new Event({
    aggregateId: eventData._id,
    aggregateType,
    eventData,
    eventType: type
  })

  await event.save()

  return event
}