// Esse arquivo é o entrypoint da Function na Vercel.
import 'dotenv/config';
import app from '../app.js';
import connectDB from '../lib/connectDB.js';

// Conecta ao Mongo apenas uma vez por cold start
let mongoReady = globalThis.__MONGO_READY__;
async function ensureDB() {
  if (!mongoReady) {
    await connectDB();
    globalThis.__MONGO_READY__ = true;
    mongoReady = true;
    console.log('[api] Mongo conectado (cold start)');
  }
}

// Wrapper que garante DB antes de delegar ao Express
export default async function handler(req, res) {
  await ensureDB();
  return app(req, res);
}

// Config da Function (Node 22, região GRU, etc.)
export const config = {
  runtime: 'nodejs22.x',
  regions: ['gru1'],
  memory: 1024,
  maxDuration: 10,
};
