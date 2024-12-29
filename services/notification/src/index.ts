import 'dotenv/config'
import { connectToRabbitMQ, consumeFromQueue } from './rabbitmq'

connectToRabbitMQ()
  .then(() => {
    consumeFromQueue()
  })