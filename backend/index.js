import 'dotenv/config';
import app from './app.js';
import connectDB from './lib/connectDB.js';

const PORT = process.env.PORT || 3000;

process.on('unhandledRejection', (err) => {
  console.error('[unhandledRejection]', err?.message || err);
});
process.on('uncaughtException', (err) => {
  console.error('[uncaughtException]', err?.message || err);
});

app.listen(PORT, async () => {
  try {
    await connectDB();
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    const origins = (process.env.CLIENT_URL || 'http://localhost:5173')
      .split(',').map(s => s.trim()).filter(Boolean);
    console.log('🌐 CORS allowed origins:', origins);
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err?.message || err);
  }
});
