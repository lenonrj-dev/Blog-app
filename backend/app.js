import express from 'express';
import cors from 'cors';
import { clerkMiddleware } from '@clerk/express';

import userRouter from './routes/user.route.js';
import postRouter from './routes/post.route.js';
import commentRouter from './routes/comment.route.js';
import webhookRouter from './routes/webhook.route.js';
import newsletterRouter from './routes/newsletter.route.js';

export function buildApp() {
  const app = express();
  app.set('trust proxy', 1);

  // CORS seguro + múltiplas origens (sem barra final!)
  const allowed = (process.env.CLIENT_URL || 'http://localhost:5173')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);

  const corsOptions = {
    origin: (origin, cb) => (!origin || allowed.includes(origin) ? cb(null, true) : cb(null, false)),
    credentials: true,
    methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type','Authorization'],
  };

  app.use(cors(corsOptions));
  // Express 5: use RegExp no preflight (nada de '*')
  app.options(/.*/, cors(corsOptions));

  // Clerk injeta req.auth (rotas públicas continuam públicas)
  app.use(clerkMiddleware());

  // Webhooks antes de parsers especiais (se necessário raw, trate dentro do router)
  app.use('/webhooks', webhookRouter);

  app.use(express.json({ limit: '5mb' }));
  app.use(express.urlencoded({ extended: true }));

  app.get('/healthz', (req, res) => res.json({ ok: true }));

  app.use('/users', userRouter);
  app.use('/posts', postRouter);
  app.use('/comments', commentRouter);
  app.use(['/newsletter', '/api/newsletter'], newsletterRouter);

  // 404 padrão
  app.use((req, res) => res.status(404).json({ message: 'Rota não encontrada' }));

  // Error handler
  app.use((err, req, res, next) => {
    const status = err.status || 500;
    res.status(status).json({
      message: err.message || 'Algo deu errado!',
      status,
      stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
    });
  });

  return app;
}
