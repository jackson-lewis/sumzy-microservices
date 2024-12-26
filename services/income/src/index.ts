import express from 'express'
import { create, deleteIncome, list, update } from './controllers/income'
import { connectToRabbitMQ } from './rabbitmq'
import { createCategory, deleteCategory, listCategories } from './controllers/category'

const port = 8004
const app = express()

connectToRabbitMQ()

app.use(express.json())
app.get('/', list)
app.post('/', create)
app.patch('/', update)
app.delete('/', deleteIncome)

app.get('/categories', listCategories)
app.post('/categories', createCategory)
app.delete('/categories', deleteCategory)

async function main() {
  try {
    app.listen(port, () => {
      console.log(`income service listening on port ${port}`)
    })
  } catch(error) {
    console.error(error)
    process.exit(1)
  }
}

main()
