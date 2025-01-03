import amqp from 'amqplib';
import { Transaction } from '@prisma/client'

export const RABBITMQ_URL = process.env.AMQP_URL
export const QUEUE_NAME = 'transaction'
export let channel: amqp.Channel

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
}


export function sendTransactionEvent(
  transaction: Transaction,
  eventType: 'created' | 'updated' | 'deleted'
) {
  if (channel) {
    const message = {
      transaction,
      eventType
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
