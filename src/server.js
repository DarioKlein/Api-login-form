import express from 'express'
import { routes } from './routes/index.js'
import bodyParser from 'body-parser'


const app = express()
const port = 3000

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  next()
})

app.use(bodyParser.json({ limit: '10mb' }));

app.use(express.json())
app.use(routes)

app.listen(port, () => {
  console.log('Server Running...')
})
