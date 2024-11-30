import amqp, { ConsumeMessage } from 'amqplib';
import { Event } from './models/event'
import { AggregateType, EventType, Expense, Income } from './types'
import { storeEvent } from './controllers/event'
import { generateReport } from './controllers/report'

export const RABBITMQ_URL = 'amqp://rabbitmq';
export const QUEUE_NAME = 'expense';
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


async function consumeEvent<T extends AggregateType>(
  message: ConsumeMessage,
  aggregateType: T
) {
  if (!message) {
    return
  }

  const data: {
    eventType: EventType
    expense: Expense
    income: Income
  } = JSON.parse(message.content.toString())

  let eventData: T extends 'expense' ? Expense : Income

  if (aggregateType === 'expense') {
    eventData = data.expense as typeof eventData
  } else {
    eventData = data.income as typeof eventData
  }

  await storeEvent(eventData, aggregateType, data.eventType)
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
    channel.consume('expense', (message) => {
      consumeEvent(message, 'expense')
    })
    channel.consume('income', (message) => {
      consumeEvent(message, 'income')
    })
  }
}
