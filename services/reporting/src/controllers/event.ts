import { EventType } from '@prisma/client'
import { prisma } from '../prisma'
import { Transaction } from '../types'

export async function storeEvent(
  eventData: Transaction,
  type: EventType
) {
  console.log(eventData)
  const event = await prisma.event.create({
    data: {
      aggregateId: Number(eventData.id),
      eventData,
      eventType: type
    }
  })

  return event
}