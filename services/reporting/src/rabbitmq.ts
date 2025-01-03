import amqp, { ConsumeMessage } from 'amqplib'
import { storeEvent } from './controllers/event'
import { generateReport } from './controllers/report'
import { EventType } from '@prisma/client'
import { Transaction, } from './types'

export const RABBITMQ_URL = process.env.AMQP_URL
export const QUEUE_NAME = 'transaction';
export let channel: amqp.Channel;

export const connectToRabbitMQ = async () => {
  try {
    // Create a connection to RabbitMQ
    const connection = await amqp.connect(RABBITMQ_URL);
    channel = await connection.createChannel();

    // Assert a queue (create it if it doesn't exist)
    await channel.assertQueue(QUEUE_NAME, {
      durable: true, // Ensure the queue survives server restarts
    });

    console.log('Connected to RabbitMQ');
  } catch (error) {
    console.error('Error connecting to RabbitMQ:', error);
  }
};


async function consumeEvent(message: ConsumeMessage) {
  if (!message) {
    return
  }

  const data: {
    eventType: EventType
    transaction: Transaction
  } = JSON.parse(message.content.toString())

  const eventData = data.transaction

  await storeEvent(eventData, data.eventType)
  const date = new Date(eventData.date)

  await generateReport(
    eventData.userId,
    date.getFullYear(), 
    date.getMonth() + 1
  )

  channel.ack(message)
}

export const consumeFromQueue = () => {
  if (channel) {
    channel.consume('transaction', (message) => {
      consumeEvent(message)
    })
  }
}
