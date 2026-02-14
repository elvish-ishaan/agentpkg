import { Router } from 'express';
import { skillService } from '../services/skill.service.js';
import { orgService } from '../services/org.service.js';
import { validateBody, validateParams } from '../middleware/validation.js';
import { requireAuth, optionalAuth, requireOrgOwner } from '../middleware/auth.js';
import { createPublishLimiter } from '../middleware/rate-limit.js';
import {
  publishSkillSchema,
  skillParamsSchema,
  skillVersionParamsSchema,
} from '../validators/skill.validator.js';
import { ForbiddenError } from '../utils/errors.js';
import { calculateChecksum } from '../utils/crypto.js';
import { z } from 'zod';

const router = Router();
const publishLimiter = createPublishLimiter();

/**
 * POST /skills/publish
 * Publish a new skill version (requires auth and org membership)
 */
router.post(
  '/publish',
  requireAuth,
  publishLimiter,
  validateBody(publishSkillSchema),
  async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { org, name, version, content, description, checksum, access } = req.body;

      // Check if user is member of the org
      const isMember = await orgService.isMember(org, req.user.id);
      if (!isMember) {
        throw new ForbiddenError('You are not a member of this organization');
      }

      // Verify checksum if provided
      const calculatedChecksum = calculateChecksum(content);
      if (checksum && checksum !== calculatedChecksum) {
        throw new ForbiddenError('Checksum mismatch');
      }

      // Publish skill
      const result = await skillService.publishSkill({
        orgName: org,
        skillName: name,
        version,
        content,
        description,
        publishedBy: req.user.id,
        access,
      });

      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * PATCH /skills/@:org/:name/access
 * Update skill access level (owner only)
 */
router.patch(
  '/@:org/:name/access',
  requireAuth,
  requireOrgOwner('org'),
  validateBody(z.object({ access: z.enum(['PRIVATE', 'PUBLIC']) })),
  async (req, res, next) => {
    try {
      const { org, name } = req.params as { org: string; name: string };
      const { access } = req.body;

      const result = await skillService.updateSkillAccess(org, name, access);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /skills/@:org/:name
 * Get latest version of a skill (public + private with auth)
 */
router.get(
  '/@:org/:name',
  optionalAuth,
  validateParams(skillParamsSchema),
  async (req, res, next) => {
    try {
      const { org, name } = req.params as { org: string; name: string };
      const userId = req.user?.id;

      const skill = await skillService.getSkill(org, name, userId);

      res.status(200).json({
        success: true,
        data: skill,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /skills/@:org/:name/versions
 * List all versions of a skill (public)
 */
router.get(
  '/@:org/:name/versions',
  validateParams(skillParamsSchema),
  async (req, res, next) => {
    try {
      const { org, name } = req.params as { org: string; name: string };

      const versions = await skillService.listSkillVersions(org, name);

      res.status(200).json({
        success: true,
        data: versions,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /skills/@:org/:name/:version
 * Get specific version of a skill (public + private with auth)
 */
router.get(
  '/@:org/:name/:version',
  optionalAuth,
  validateParams(skillVersionParamsSchema),
  async (req, res, next) => {
    try {
      const { org, name, version } = req.params as { org: string; name: string; version: string };
      const userId = req.user?.id;

      const skill = await skillService.getSkillVersion(org, name, version, userId);

      res.status(200).json({
        success: true,
        data: skill,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /skills/@:org
 * List all skills in an organization (public)
 */
router.get('/@:org', async (req, res, next) => {
  try {
    const { org } = req.params;

    const skills = await skillService.listOrgSkills(org);

    res.status(200).json({
      success: true,
      data: skills,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /skills
 * List all skills (public + user's private skills if authenticated)
 */
router.get('/', optionalAuth, async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const skills = await skillService.listAllSkills(userId);

    res.status(200).json({
      success: true,
      data: skills,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
