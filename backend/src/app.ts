import express from 'express';
import cors from 'cors';
import { config } from './config';
import { authMiddleware } from './middlewares/authMiddleware';
import { errorHandler } from './middlewares/errorMiddleware';
import apiRoutes from './routes';

export const app = express();

// Global Middlewares
app.use(cors({
  origin: config.corsOrigins,
  credentials: true
}));

app.use(express.json());

// Governance Auth Middleware (injects current role and session)
app.use(authMiddleware);

// API Routes
app.use('/api', apiRoutes);

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ status: 'UP', service: 'Unified Student Lifecycle Management API', timestamp: new Date() });
});

// Global Error Handler
app.use(errorHandler);
