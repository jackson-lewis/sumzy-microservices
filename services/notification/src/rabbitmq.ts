import amqp from 'amqplib'
import { UnverifiedUser } from './types/user'
import { sendUserVerifyEmail } from './lib/user'

export const RABBITMQ_URL = 'amqp://rabbitmq'
export const QUEUE_USER_SIGN_UP = 'user-sign-up'
export let channel: amqp.Channel

export const connectToRabbitMQ = async () => {
  try {
    const connection = await amqp.connect(RABBITMQ_URL)
    channel = await connection.createChannel()

    await channel.assertQueue(QUEUE_USER_SIGN_UP, {
      durable: true
    })

    console.log('Connected to RabbitMQ')
  } catch (error) {
    console.error('Error connecting to RabbitMQ:', error)
  }
}

export const consumeFromQueue = () => {
  if (channel) {
    channel.consume(QUEUE_USER_SIGN_UP, (message) => {
      const user: UnverifiedUser = JSON.parse(message.content.toString())
      sendUserVerifyEmail(user)
    })
  }
}
