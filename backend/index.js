import 'dotenv/config'

import express from 'express'
import cors from 'cors'
import { clerkMiddleware } from '@clerk/express'

import connectDB from './lib/connectDB.js'
import userRouter from './routes/user.route.js'
import postRouter from './routes/post.route.js'
import commentRouter from './routes/comment.route.js'
import webhookRouter from './routes/webhook.route.js'
import newsletterRouter from './routes/newsletter.route.js'

const app = express()

// Se estiver atrás de proxy (Vercel/NGINX/etc.)
app.set('trust proxy', 1)

// --- CORS ---------------------------------------------------------------
// Defina CLIENT_URL no .env do backend (ex.: "http://localhost:5173,https://seu-front.vercel.app")
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean)

const corsOptions = {
  origin: (origin, cb) => {
    if (!origin) return cb(null, true) // cURL/Postman/mesmo host
    const ok = allowedOrigins.includes(origin)
    return cb(null, ok)
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}

// Aplique CORS globalmente **antes** de qualquer outra coisa
app.use(cors(corsOptions))
// Express 5: NADA de '*'. Use regex para cobrir todos os caminhos no preflight:
app.options(/.*/, cors(corsOptions))

// --- Clerk (injeta req.auth; rotas públicas continuam públicas) --------
app.use(clerkMiddleware())

// --- Webhooks (se precisar de raw body, trate dentro do router) -------
app.use('/webhooks', webhookRouter)

// --- Body parsers ------------------------------------------------------
app.use(express.json({ limit: '5mb' }))
app.use(express.urlencoded({ extended: true }))

// --- Healthcheck -------------------------------------------------------
app.get('/healthz', (req, res) => res.status(200).json({ ok: true }))

// --- Rotas -------------------------------------------------------------
app.use('/users', userRouter)
app.use('/posts', postRouter)
app.use('/comments', commentRouter)
// Conveniência: aceita /newsletter e /api/newsletter
app.use(['/newsletter', '/api/newsletter'], newsletterRouter)

// --- 404 padrão --------------------------------------------------------
app.use((req, res) => {
  res.status(404).json({ message: 'Rota não encontrada' })
})

// --- Error Handler ------------------------------------------------------
app.use((error, req, res, next) => {
  const status = error.status || 500
  res.status(status).json({
    message: error.message || 'Algo deu errado!',
    status,
    stack: process.env.NODE_ENV === 'production' ? undefined : error.stack,
  })
})

// --- Start --------------------------------------------------------------
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  connectDB()
  console.log(`Server running on http://localhost:${PORT}`)
  console.log('CORS allowed origins:', allowedOrigins)
})
