import express from 'express'
import {
  create,
  get,
  login,
  update,
  handleVerifyEmailToken,
  forgotPassword,
  resetPassword
} from './controller'
import { connectToRabbitMQ } from './rabbitmq'

const port = 8001
const app = express()

connectToRabbitMQ()

app.use(express.json())

app.use('/health', (req, res) => {
  res.status(200).send('OK')
})

app.post('/', create)
app.get('/', get)
app.patch('/', update)

app.post('/login', login)
app.post('/verify-email-token', handleVerifyEmailToken)
app.post('/forgot-password', forgotPassword)
app.post('/reset-password', resetPassword)

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
