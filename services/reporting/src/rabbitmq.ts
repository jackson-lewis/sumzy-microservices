import amqp from 'amqplib';
import { Event } from './models/event'
import { Expense } from './types'
import { storeEvent } from './controllers/event'
import { generateReport } from './controllers/report'

export const RABBITMQ_URL = 'amqp://rabbitmq';
export const QUEUE_NAME = 'expense.created';
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

// Function to send messages to the queue
export const sendToQueue = (message: string) => {
  if (channel) {
    channel.sendToQueue(QUEUE_NAME, Buffer.from(message), {
      persistent: true, // Ensure the message survives server restarts
    });
    console.log('Message sent:', message);
  }
};


export const consumeFromQueue = () => {
  if (channel) {
    channel.consume(QUEUE_NAME, async (msg) => {
      if (msg) {
        const expense: Expense = JSON.parse(msg.content.toString());

        await storeEvent(expense)
        await generateReport(expense.userId)

        // Acknowledge the message as processed
        channel.ack(msg);
      }
    });
  }
};