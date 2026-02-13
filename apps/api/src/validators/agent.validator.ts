import { z } from 'zod';

/**
 * Publish agent schema
 */
export const publishAgentSchema = z.object({
  org: z
    .string()
    .min(2, 'Organization name must be at least 2 characters')
    .max(50, 'Organization name is too long')
    .regex(/^[a-z0-9-]+$/, 'Organization name must contain only lowercase letters, numbers, and hyphens'),
  name: z
    .string()
    .min(2, 'Agent name must be at least 2 characters')
    .max(50, 'Agent name is too long')
    .regex(/^[a-z0-9-]+$/, 'Agent name must contain only lowercase letters, numbers, and hyphens'),
  version: z
    .string()
    .regex(/^\d+\.\d+\.\d+$/, 'Version must be in semver format (e.g., 0.1.0)'),
  content: z
    .string()
    .min(1, 'Agent content is required')
    .max(200 * 1024, 'Agent content exceeds 200KB limit'),
  description: z
    .string()
    .max(500, 'Description is too long')
    .optional(),
  checksum: z
    .string()
    .regex(/^[a-f0-9]{64}$/, 'Invalid checksum format (must be SHA-256 hex)')
    .optional(),
});

/**
 * Agent name parameter schema
 */
export const agentParamsSchema = z.object({
  org: z
    .string()
    .min(2, 'Organization name must be at least 2 characters')
    .max(50, 'Organization name is too long'),
  name: z
    .string()
    .min(2, 'Agent name must be at least 2 characters')
    .max(50, 'Agent name is too long'),
});

/**
 * Agent version parameter schema
 */
export const agentVersionParamsSchema = z.object({
  org: z
    .string()
    .min(2, 'Organization name must be at least 2 characters')
    .max(50, 'Organization name is too long'),
  name: z
    .string()
    .min(2, 'Agent name must be at least 2 characters')
    .max(50, 'Agent name is too long'),
  version: z
    .string()
    .regex(/^\d+\.\d+\.\d+$/, 'Version must be in semver format (e.g., 0.1.0)'),
});

/**
 * Organization name schema
 */
export const orgNameSchema = z.object({
  name: z
    .string()
    .min(2, 'Organization name must be at least 2 characters')
    .max(50, 'Organization name is too long')
    .regex(/^[a-z0-9-]+$/, 'Organization name must contain only lowercase letters, numbers, and hyphens')
    .regex(/^[a-z]/, 'Organization name must start with a letter'),
});

/**
 * Add member schema
 */
export const addMemberSchema = z.object({
  userId: z
    .string()
    .min(1, 'User ID is required'),
});
