import 'dotenv/config';
import serverless from 'serverless-http';
import { buildApp } from '../app.js';
import connectDB from '../lib/connectDB.js';

// aquece a conexão no cold-start
await connectDB();

const app = buildApp();
export default serverless(app);
