import 'dotenv/config'
import express from 'express'
import httpProxy from 'express-http-proxy'
import cors from 'cors'
import auth from './auth'

const port = 8000
const app = express()
app.use(express.json())
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://sumzy.vercel.app'
  ]
}))
app.use('/v1/reporting*', auth)
app.use('/v1/users*', auth)
app.use('/v1/transactions*', auth)

app.use('/health', (req, res) => {
  res.status(200).send('OK')
})

app.use('/test-user-service', async (req, res) => {
  const url = req.query.url as string
  console.log(`Making request to http://${url}`)
  
  try {
    const userHostRes = await fetch(`http://${url}`)
    res.status(200).send({
      status: userHostRes.status,
      text: await userHostRes.text()
    })
  } catch(error) {
    console.error(error)
    res.status(500).send({
      error: error.message
    })
  }
})

type Service = {
  endpoint: string,
  host: string
}

const services: Service[] = [
  {
    endpoint: '/v1/users',
    host: 'user:8001'
  },
  {
    endpoint: '/v1/reporting',
    host: 'reporting:8003'
  },
  {
    endpoint: '/v1/transactions',
    host: 'transaction:8005'
  }
]

services.map(({ endpoint, host }) => {
  app.use(
    endpoint,
    httpProxy(
      `http://${host}`,
      {
        timeout: 10,
        proxyErrorHandler: (err, res, next) => {
          switch (err.code) {
            case 'ECONNREFUSED':
              return res.status(503).send('Service unavailable')
            default:
              return next(err)
          }
        }
      }
    )
  )
})

app.listen(port, () => {
  console.log(`api gateway listening on port ${port}`)
})