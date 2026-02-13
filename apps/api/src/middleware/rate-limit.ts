import rateLimit from 'express-rate-limit';
import { getEnv } from '../config/env.js';

/**
 * General rate limiter for all routes
 */
export function createGeneralLimiter() {
  const env = getEnv();

  return rateLimit({
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    max: env.RATE_LIMIT_MAX_REQUESTS,
    message: {
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many requests, please try again later',
      },
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
}

/**
 * Stricter rate limiter for auth endpoints
 */
export function createAuthLimiter() {
  const env = getEnv();

  return rateLimit({
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    max: env.RATE_LIMIT_AUTH_MAX,
    message: {
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many authentication attempts, please try again later',
      },
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
  });
}

/**
 * Rate limiter for publish endpoints
 */
export function createPublishLimiter() {
  const env = getEnv();

  return rateLimit({
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    max: env.RATE_LIMIT_PUBLISH_MAX,
    message: {
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many publish requests, please try again later',
      },
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
}
