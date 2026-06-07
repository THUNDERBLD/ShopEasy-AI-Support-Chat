// Server/src/index.ts

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { validateEnv, PORT } from './config/constants.js';
import { runMigrations } from './db/migrations.js';
import chatRouter from './routes/chat.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

// Validate env vars before anything else
validateEnv();

// Run DB migrations
runMigrations();

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));

app.use(express.json({ limit: '10kb' }));

// Health check
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', provider: process.env.LLM_PROVIDER ?? 'gemini' });
});

// Routes
app.use('/chat', chatRouter);

// Global error handler — must be last
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});