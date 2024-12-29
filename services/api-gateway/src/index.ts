import express from 'express'
import httpProxy from 'express-http-proxy'
import cors from 'cors'
import auth from './auth'

const port = 8000
const app = express()
app.use(express.json())
app.use(cors({
  origin: 'http://localhost:3000'
}))
app.use('/v1/reporting*', auth)
app.use('/v1/users*', auth)
app.use('/v1/transactions*', auth)

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