import amqp from 'amqplib';
import { Expense, EventType } from '../types'
export const RABBITMQ_URL = 'amqp://rabbitmq';
export const QUEUE_NAME = 'expense';
export let channel: amqp.Channel;

export const connectToRabbitMQ = async () => {
  console.log('attempting to connect to rabbitmq')
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


export function sendExpenseEvent(expense: Expense, eventType: EventType) {
  if (channel) {
    const message = {
      expense,
      eventType,
      aggregateType: 'expense'
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
