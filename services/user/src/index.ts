import express from 'express'
import { connect } from 'mongoose'
import { create, login } from './controller'

const port = 8001
const app = express()

app.use(express.json())
app.post('/', create)
app.post('/login', login)

async function main() {
  try {
    await connect('mongodb://mongo:27017/users')
  
    app.listen(port, () => {
      console.log(`user service listening on port ${port}`)
    })
  } catch(error) {
    console.error(error)
    process.exit(1)
  }
}

main()
