import express from 'express'
import { connect } from 'mongoose'
import { connectToRabbitMQ, consumeFromQueue } from './rabbitmq'
import { get } from './controllers/report'

const port = 8003
const app = express()

connectToRabbitMQ()
  .then(() => {
    consumeFromQueue()
  })

app.use(express.json())
app.get('/:year/:month', get)


async function main() {
  try {
    await connect('mongodb://mongo:27017/reporting')
  
    app.listen(port, () => {
      console.log(`reporting service listening on port ${port}`)
    })
  } catch(error) {
    console.error(error)
    process.exit(1)
  }
}

main()
