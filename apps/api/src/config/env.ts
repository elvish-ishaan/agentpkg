import { z } from 'zod';
import { logger } from '../utils/logger.js';

const envSchema = z.object({
  // Server
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('4000').transform(Number),
  API_BASE_URL: z.string().url().default('http://localhost:4000'),

  // Database
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),

  // GCP Storage
  GCP_PROJECT_ID: z.string().min(1, 'GCP_PROJECT_ID is required'),
  GCP_BUCKET_NAME: z.string().min(1, 'GCP_BUCKET_NAME is required'),
  GCP_KEY_FILE: z.string().optional(),

  // Security
  API_TOKEN_SECRET: z.string().min(32, 'API_TOKEN_SECRET must be at least 32 characters'),
  BCRYPT_ROUNDS: z.string().default('10').transform(Number),

  // CORS
  CORS_ORIGIN: z.string().default('http://localhost:3000'),

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: z.string().default('900000').transform(Number),
  RATE_LIMIT_MAX_REQUESTS: z.string().default('100').transform(Number),
  RATE_LIMIT_AUTH_MAX: z.string().default('5').transform(Number),
  RATE_LIMIT_PUBLISH_MAX: z.string().default('10').transform(Number),
});

export type Env = z.infer<typeof envSchema>;

let env: Env;

export function loadEnv(): Env {
  try {
    env = envSchema.parse(process.env);
    logger.info('Environment variables validated successfully');
    return env;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join('\n');
      logger.error('Environment validation failed:\n' + errors);
      throw new Error('Invalid environment configuration');
    }
    throw error;
  }
}

export function getEnv(): Env {
  if (!env) {
    env = loadEnv();
  }
  return env;
}
