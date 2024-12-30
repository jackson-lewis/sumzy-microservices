import amqp from 'amqplib'
import { ForgotPasswordUser, UnverifiedUser, User } from './types/user'
import { sendPasswordResetEmail, sendPasswordResetSuccessEmail, sendUserVerifyEmail } from './lib/user'

export const RABBITMQ_URL = 'amqp://rabbitmq'
export const QUEUE_USER_SIGN_UP = 'user-sign-up'
export const QUEUE_USER_FORGOT_PASSWORD = 'user-forgot-password'
export const QUEUE_USER_RESET_PASSWORD = 'user-reset-password'
export let channel: amqp.Channel

export const connectToRabbitMQ = async () => {
  try {
    const connection = await amqp.connect(RABBITMQ_URL)
    channel = await connection.createChannel()

    await channel.assertQueue(QUEUE_USER_SIGN_UP, {
      durable: true
    })

    await channel.assertQueue(QUEUE_USER_FORGOT_PASSWORD, {
      durable: true
    })

    await channel.assertQueue(QUEUE_USER_RESET_PASSWORD, {
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

    channel.consume(QUEUE_USER_FORGOT_PASSWORD, (message) => {
      const user: ForgotPasswordUser = JSON.parse(
        message.content.toString()
      )
      sendPasswordResetEmail(user)
    })

    channel.consume(QUEUE_USER_RESET_PASSWORD, (message) => {
      const user: User = JSON.parse(
        message.content.toString()
      )
      sendPasswordResetSuccessEmail(user)
    })
  }
}
