import 'dotenv/config';
import { buildApp } from './app.js';
import connectDB from './lib/connectDB.js';

const PORT = process.env.PORT || 3000;

(async () => {
  await connectDB();
  const app = buildApp();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
})();
