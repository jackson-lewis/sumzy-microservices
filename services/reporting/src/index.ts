import express from 'express'
import { connectToRabbitMQ, consumeFromQueue } from './rabbitmq'
import { get, generate } from './controllers/report'

const port = 8003
const app = express()

connectToRabbitMQ()
  .then(() => {
    consumeFromQueue()
  })

app.use(express.json())
app.get('/:year/:month', get)
app.get('/generate/:year/:month', generate)


async function main() {
  try {
    app.listen(port, () => {
      console.log(`reporting service listening on port ${port}`)
    })
  } catch(error) {
    console.error(error)
    process.exit(1)
  }
}

main()
