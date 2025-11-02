import mongoose from 'mongoose';

let cached = global._mongooseConn;
if (!cached) cached = (global._mongooseConn = { conn: null, promise: null });

export default async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const uri = process.env.MONGO;
    if (!uri) throw new Error('ENV MONGO não configurado');

    mongoose.set('strictQuery', true);

    cached.promise = mongoose
      .connect(uri, {
        serverSelectionTimeoutMS: 8000, // falha rápido
        maxPoolSize: 10,
        retryWrites: true,
      })
      .then((m) => {
        console.log('MongoDB conectado');
        return m;
      })
      .catch((e) => {
        console.error('Erro ao conectar MongoDB:', e?.message || e);
        throw e;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
