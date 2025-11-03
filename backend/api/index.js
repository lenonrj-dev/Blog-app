// Esse arquivo é o entrypoint da Serverless Function na Vercel.
import 'dotenv/config';
import mongoose from 'mongoose';
import app from '../app.js';
import connectDB from '../lib/connectDB.js';

// Conecta ao Mongo apenas em cold start (ou se a conexão não estiver ativa)
async function ensureDB() {
  const state = mongoose.connection.readyState; // 1=connected, 2=connecting
  if (state === 1 || state === 2) return;
  await connectDB();
  console.log('[api] Mongo conectado');
}

// Handler da Function (Node.js)
export default async function handler(req, res) {
  await ensureDB();
  return app(req, res);
}

// Config da Function — use "nodejs" (não use "nodejs22.x")
export const config = {
  runtime: 'nodejs',
  memory: 1024,
  maxDuration: 10,
};
