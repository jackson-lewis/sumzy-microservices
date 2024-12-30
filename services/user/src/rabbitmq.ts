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
  user: User & { emailVerifyLink: string }
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

export function sendUserForgotPasswordEvent(
  user: User & { resetPasswordLink: string }
) {
  if (channel) {
    channel.sendToQueue(
      'user-forgot-password',
      Buffer.from(JSON.stringify(user)),
      {
        persistent: true
      }
    )

    console.log('User forgot-password event sent to RabbitMQ')
  }
}

export function sendUserResetPasswordEvent(
  user: User
) {
  if (channel) {
    channel.sendToQueue(
      'user-reset-password',
      Buffer.from(JSON.stringify(user)),
      {
        persistent: true
      }
    )

    console.log('User reset-password event sent to RabbitMQ')
  }
}
