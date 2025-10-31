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

// Se estiver atrás de proxy (Railway/Render/Vercel/NGINX), isso garante IP correto em req.ip / x-forwarded-for
app.set('trust proxy', 1)

// --- CORS ---------------------------------------------------------------
// Use CLIENT_URL no .env do backend. Suporta múltiplos domínios separados por vírgula.
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((s) => s.trim())

const corsOptions = {
  origin: (origin, cb) => {
    // Permite chamadas sem "origin" (ex.: cURL, Postman) e do mesmo host
    if (!origin) return cb(null, true)
    if (allowedOrigins.includes(origin)) return cb(null, true)
    return cb(null, false)
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}

app.use(cors(corsOptions))
// Responde pré-flight de forma segura sem wildcard
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') return res.sendStatus(204)
  next()
})

// --- Clerk --------------------------------------------------------------
// (Apenas adiciona req.auth; não bloqueia rotas públicas como newsletter)
app.use(clerkMiddleware())

// --- Webhooks (antes do body parser se precisar de raw body) ------------
// Se o webhook exigir body "raw", deixe o raw parser dentro do próprio router.
app.use('/webhooks', webhookRouter)

// --- Body parser --------------------------------------------------------
app.use(express.json({ limit: '5mb' }))
app.use(express.urlencoded({ extended: true })) // suporta form-encoded (caso envie formulário)

// --- Healthcheck --------------------------------------------------------
app.get('/healthz', (req, res) => res.status(200).json({ ok: true }))

// --- Rotas --------------------------------------------------------------
app.use('/users', userRouter)
app.use('/posts', postRouter)
app.use('/comments', commentRouter)
// Suporta ambos caminhos para conveniência: /newsletter e /api/newsletter
app.use(['/newsletter', '/api/newsletter'], newsletterRouter)

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
  console.log(`Server is running on http://localhost:${PORT}`)
  console.log('CORS allowed origins:', allowedOrigins)
})
