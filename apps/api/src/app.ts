import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import pinoHttp from 'pino-http';
import { getEnv } from './config/env.js';
import { logger } from './utils/logger.js';
import { errorHandler, notFoundHandler } from './middleware/error-handler.js';
import { createGeneralLimiter } from './middleware/rate-limit.js';

// Routes
import authRoutes from './routes/auth.routes.js';
import orgsRoutes from './routes/orgs.routes.js';
import agentsRoutes from './routes/agents.routes.js';

export function createApp() {
  const app = express();
  const env = getEnv();

  // Security middleware
  app.use(helmet());

  // CORS
  app.use(
    cors({
      origin: env.CORS_ORIGIN.split(',').map((origin) => origin.trim()),
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  // Body parsing
  app.use(express.json({ limit: '250kb' }));
  app.use(express.urlencoded({ extended: true, limit: '250kb' }));

  // Cookie parsing
  app.use(cookieParser());

  // Logging
  app.use(
    pinoHttp({
      logger,
      customLogLevel: (_req, res, err) => {
        if (res.statusCode >= 500 || err) return 'error';
        if (res.statusCode >= 400) return 'warn';
        return 'info';
      },
      customSuccessMessage: (req, res) => {
        return `${req.method} ${req.url} - ${res.statusCode}`;
      },
      customErrorMessage: (req, res, err) => {
        return `${req.method} ${req.url} - ${res.statusCode} - ${err.message}`;
      },
    })
  );

  // Rate limiting
  app.use(createGeneralLimiter());

  // Health check
  app.get('/health', (_, res) => {
    res.status(200).json({
      success: true,
      message: 'AgentPKG API is running',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  });

  // API routes
  app.use('/auth', authRoutes);
  app.use('/orgs', orgsRoutes);
  app.use('/agents', agentsRoutes);

  // 404 handler
  app.use(notFoundHandler);

  // Error handler (must be last)
  app.use(errorHandler);

  return app;
}
