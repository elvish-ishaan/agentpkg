import { z } from 'zod';

/**
 * Publish skill schema
 */
export const publishSkillSchema = z.object({
  org: z
    .string()
    .min(2, 'Organization name must be at least 2 characters')
    .max(50, 'Organization name is too long')
    .regex(/^[a-z0-9-]+$/, 'Organization name must contain only lowercase letters, numbers, and hyphens'),
  name: z
    .string()
    .min(2, 'Skill name must be at least 2 characters')
    .max(50, 'Skill name is too long')
    .regex(/^[a-z0-9-]+$/, 'Skill name must contain only lowercase letters, numbers, and hyphens'),
  version: z
    .string()
    .regex(/^\d+\.\d+\.\d+$/, 'Version must be in semver format (e.g., 0.1.0)'),
  content: z
    .string()
    .min(1, 'Skill content is required')
    .max(200 * 1024, 'Skill content exceeds 200KB limit'),
  description: z
    .string()
    .max(500, 'Description is too long')
    .optional(),
  checksum: z
    .string()
    .regex(/^[a-f0-9]{64}$/, 'Invalid checksum format (must be SHA-256 hex)')
    .optional(),
  access: z
    .enum(['PRIVATE', 'PUBLIC'])
    .optional(),
});

/**
 * Skill name parameter schema
 */
export const skillParamsSchema = z.object({
  org: z
    .string()
    .min(2, 'Organization name must be at least 2 characters')
    .max(50, 'Organization name is too long'),
  name: z
    .string()
    .min(2, 'Skill name must be at least 2 characters')
    .max(50, 'Skill name is too long'),
});

/**
 * Skill version parameter schema
 */
export const skillVersionParamsSchema = z.object({
  org: z
    .string()
    .min(2, 'Organization name must be at least 2 characters')
    .max(50, 'Organization name is too long'),
  name: z
    .string()
    .min(2, 'Skill name must be at least 2 characters')
    .max(50, 'Skill name is too long'),
  version: z
    .string()
    .regex(/^\d+\.\d+\.\d+$/, 'Version must be in semver format (e.g., 0.1.0)'),
});
