import express from 'express'
import { connect } from 'mongoose'
import { create, deleteIncome, list, update } from './controllers/income'
import { connectToRabbitMQ } from './rabbitmq'

const port = 8004
const app = express()

connectToRabbitMQ()

app.use(express.json())
app.get('/', list)
app.post('/', create)
app.patch('/', update)
app.delete('/', deleteIncome)

async function main() {
  try {
    await connect('mongodb://mongo:27017/income')
  
    app.listen(port, () => {
      console.log(`income service listening on port ${port}`)
    })
  } catch(error) {
    console.error(error)
    process.exit(1)
  }
}

main()
