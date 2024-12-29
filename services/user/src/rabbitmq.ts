import amqp from 'amqplib'
import { User } from '@prisma/client'

export const RABBITMQ_URL = 'amqp://rabbitmq'
export const QUEUE_NAME = 'user-sign-up'
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


export function sendUserSignUpEvent(
  user: User
) {
  if (channel) {
    channel.sendToQueue(
      QUEUE_NAME,
      Buffer.from(JSON.stringify(user)),
      {
        persistent: true
      }
    )

    console.log('User sign-up event sent to RabbitMQ')
  }
}
