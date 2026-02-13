import { z } from 'zod';

/**
 * User registration schema
 */
export const registerSchema = z.object({
  email: z
    .string()
    .email('Invalid email address')
    .min(1, 'Email is required')
    .max(255, 'Email is too long'),
  username: z
    .string()
    .min(2, 'Username must be at least 2 characters')
    .max(50, 'Username must be at most 50 characters')
    .regex(/^[a-z0-9-]+$/, 'Username must contain only lowercase letters, numbers, and hyphens')
    .regex(/^[a-z]/, 'Username must start with a letter'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(255, 'Password is too long'),
});

/**
 * User login schema
 */
export const loginSchema = z.object({
  email: z
    .string()
    .email('Invalid email address')
    .min(1, 'Email is required'),
  password: z
    .string()
    .min(1, 'Password is required'),
});

/**
 * Create token schema
 */
export const createTokenSchema = z.object({
  name: z
    .string()
    .min(1, 'Token name is required')
    .max(100, 'Token name is too long')
    .optional(),
});

/**
 * Revoke token schema
 */
export const revokeTokenSchema = z.object({
  tokenId: z
    .string()
    .min(1, 'Token ID is required'),
});
