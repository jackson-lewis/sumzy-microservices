import { Kafka } from 'kafkajs'

export const kafka = new Kafka({
  clientId: 'finance-tracker',
  brokers: ['localhost:9092']
})

