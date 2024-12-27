import express from 'express'
import {
  batch,
  create,
  deleteExpense,
  list,
  update
} from './controllers/transaction'
import {
  createCategory,
  deleteCategory,
  listCategories
} from './controllers/category'
import { connectToRabbitMQ } from './rabbitmq'

const port = 8005
const app = express()

connectToRabbitMQ()

app.use(express.json())
app.get('/', list)
app.post('/', create)
app.patch('/', update)
app.delete('/', deleteExpense)

app.post('/batch', batch)

app.get('/categories', listCategories)
app.post('/categories', createCategory)
app.delete('/categories', deleteCategory)

async function main() {
  try {
    app.listen(port, () => {
      console.log(`expense service listening on port ${port}`)
    })
  } catch(error) {
    console.error(error)
    process.exit(1)
  }
}

main()
