import { prisma } from '../prisma'
import { AggregateType, EventType, Expense, Income } from '../types'

export async function storeEvent<T extends Expense | Income>(
  eventData: T,
  aggregateType: AggregateType,
  type: EventType
) {
  const event = await prisma.event.create({
    data: {
      aggregateId: Number(eventData.id),
      aggregateType,
      eventData,
      eventType: type
    }
  })

  return event
}