import express from 'express'
import { connect } from 'mongoose'
import { create, deleteExpense, list, update } from './controller'
import { createCategory, deleteCategory, listCategories } from './category'

const port = 8002
const app = express()

app.use(express.json())
app.get('/', list)
app.post('/', create)
app.patch('/', update)
app.delete('/', deleteExpense)

app.get('/categories', listCategories)
app.post('/categories', createCategory)
app.delete('/categories', deleteCategory)

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
