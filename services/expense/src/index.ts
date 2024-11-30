import express from 'express'
import { connect } from 'mongoose'
import { batchCreate, create, deleteExpense, list, update } from './controllers/expense'
import { createCategory, deleteCategory, listCategories } from './controllers/category'
import { create as createReport, get as getReport } from './controllers/report'
import { connectToRabbitMQ } from './rabbitmq'

const port = 8002
const app = express()

connectToRabbitMQ()

app.use(express.json())
app.get('/', list)
app.post('/', create)
app.patch('/', update)
app.delete('/', deleteExpense)

app.post('/batch', batchCreate)

app.get('/categories', listCategories)
app.post('/categories', createCategory)
app.delete('/categories', deleteCategory)

app.post('/reports', createReport)
app.get('/reports', getReport)

async function main() {
  try {
    await connect('mongodb://mongo:27017/expenses')
  
    app.listen(port, () => {
      console.log(`expense service listening on port ${port}`)
    })
  } catch(error) {
    console.error(error)
    process.exit(1)
  }
}

main()
