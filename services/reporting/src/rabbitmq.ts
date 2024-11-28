import amqp from 'amqplib';
import { Event } from './models/event'
import { EventType, Expense } from './types'
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


export const consumeFromQueue = () => {
  if (channel) {
    channel.consume(QUEUE_NAME, async (msg) => {
      if (msg) {
        const {
          expense,
          eventType
        }: {
          expense: Expense,
          eventType: EventType
        } = JSON.parse(msg.content.toString())

        await storeEvent(expense, eventType)
        const expenseDate = new Date(expense.date)
        await generateReport(
          expense.userId,
          expenseDate.getFullYear(), 
          expenseDate.getMonth() + 1
        )

        channel.ack(msg)
      }
    });
  }
};