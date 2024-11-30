import amqp from 'amqplib';
import { EventType, Income } from '../types'

export const RABBITMQ_URL = 'amqp://rabbitmq'
export const QUEUE_NAME = 'income'
export let channel: amqp.Channel

export const connectToRabbitMQ = async () => {
  try {
    const connection = await amqp.connect(RABBITMQ_URL)
    channel = await connection.createChannel()

    await channel.assertQueue(QUEUE_NAME, {
      durable: true
    })

    console.log('Connected to RabbitMQ')
  } catch (error) {
    console.error('Error connecting to RabbitMQ:', error)
  }
}


export function sendIncomeEvent(income: Income, eventType: EventType) {
  if (channel) {
    const message = {
      income,
      eventType,
      aggregateType: 'income'
    }

    channel.sendToQueue(
      QUEUE_NAME,
      Buffer.from(JSON.stringify(message)),
      {
        persistent: true
      }
    )
    
    console.log('Message sent:', message)
  }
}
