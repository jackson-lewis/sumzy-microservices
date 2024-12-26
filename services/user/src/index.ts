import express from 'express'
import { create, get, login } from './controller'

const port = 8001
const app = express()

app.use(express.json())
app.post('/', create)
app.get('/', get)
app.post('/login', login)

async function main() {
  try {
    app.listen(port, () => {
      console.log(`user service listening on port ${port}`)
    })
  } catch(error) {
    console.error(error)
    process.exit(1)
  }
}

main()
