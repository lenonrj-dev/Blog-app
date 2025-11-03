import express from 'express';
import cors from 'cors';
import { clerkMiddleware } from '@clerk/express';

import userRouter from './routes/user.route.js';
import postRouter from './routes/post.route.js';
import commentRouter from './routes/comment.route.js';
import webhookRouter from './routes/webhook.route.js';
import newsletterRouter from './routes/newsletter.route.js';

const app = express();

// Se estiver atrás de proxy (Vercel/NGINX/etc.)
app.set('trust proxy', 1);

// --- CORS ---------------------------------------------------------------
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

const corsOptions = {
  origin: (origin, cb) => {
    if (!origin) return cb(null, true); // cURL/Postman/mesmo host
    const ok = allowedOrigins.includes(origin);
    return cb(null, ok);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
// Preflight para todos os caminhos (Express 5 não aceita '*')
app.options(/.*/, cors(corsOptions));

// --- Clerk (injeta req.auth; rotas públicas continuam públicas) --------
app.use(clerkMiddleware());

// --- Webhooks (se precisar de raw body, trate dentro do router) -------
app.use('/webhooks', webhookRouter);

// --- Body parsers ------------------------------------------------------
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

// --- Página raiz “online” ----------------------------------------------
app.get('/', (req, res) => {
  const env = process.env.NODE_ENV || 'development';
  const startedAt = new Date().toISOString();
  res
    .status(200)
    .type('html')
    .send(`<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>SYN API • Online</title>
<style>
  :root { color-scheme: light dark; }
  body { font-family: ui-sans-serif, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 40px; background:#0b0b0b; color:#f5f5f5; }
  .card { max-width: 840px; margin: 0 auto; background: #111; border: 1px solid #222; border-radius: 16px; padding: 24px; }
  h1 { margin: 0 0 6px 0; font-size: 24px; }
  .muted { color:#9ca3af; font-size: 14px; }
  code, pre { background:#0f172a; color:#e5e7eb; padding: 2px 6px; border-radius: 6px; }
  a { color:#60a5fa; text-decoration: none; }
  a:hover { text-decoration: underline; }
  ul { line-height: 1.8; }
</style>
</head>
<body>
  <div class="card">
    <h1>✅ SYN API está online</h1>
    <p class="muted">Ambiente: <code>${env}</code> • Iniciada: <code>${startedAt}</code></p>
    <ul>
      <li>Healthcheck: <a href="/healthz"><code>/healthz</code></a></li>
      <li>Posts: <code>/posts</code></li>
      <li>Comentários: <code>/comments</code></li>
      <li>Usuários: <code>/users</code></li>
      <li>Newsletter: <code>/newsletter/subscribe</code></li>
    </ul>
    <p class="muted">CORS permitido para: <code>${allowedOrigins.join(', ') || '—'}</code></p>
  </div>
</body>
</html>`);
});

// --- Healthcheck -------------------------------------------------------
app.get('/healthz', (req, res) => res.status(200).json({ ok: true }));

// --- Rotas -------------------------------------------------------------
app.use('/users', userRouter);
app.use('/posts', postRouter);
app.use('/comments', commentRouter);
// Conveniência: aceita /newsletter e /api/newsletter
app.use(['/newsletter', '/api/newsletter'], newsletterRouter);

// --- 404 padrão (depois das rotas) ------------------------------------
app.use((req, res) => {
  res.status(404).json({ message: 'Rota não encontrada' });
});

// --- Error Handler ------------------------------------------------------
app.use((error, req, res, next) => {
  const status = error.status || 500;
  res.status(status).json({
    message: error.message || 'Algo deu errado!',
    status,
    stack: process.env.NODE_ENV === 'production' ? undefined : error.stack,
  });
});

export default app;
