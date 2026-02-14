import { Router } from 'express';
import { agentService } from '../services/agent.service.js';
import { orgService } from '../services/org.service.js';
import { validateBody, validateParams } from '../middleware/validation.js';
import { requireAuth, optionalAuth, requireOrgOwner } from '../middleware/auth.js';
import { createPublishLimiter } from '../middleware/rate-limit.js';
import {
  publishAgentSchema,
  agentParamsSchema,
  agentVersionParamsSchema,
} from '../validators/agent.validator.js';
import { ForbiddenError } from '../utils/errors.js';
import { calculateChecksum } from '../utils/crypto.js';
import { z } from 'zod';

const router = Router();
const publishLimiter = createPublishLimiter();

/**
 * POST /agents/publish
 * Publish a new agent version (requires auth and org membership)
 */
router.post(
  '/publish',
  requireAuth,
  publishLimiter,
  validateBody(publishAgentSchema),
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

      // Publish agent
      const result = await agentService.publishAgent({
        orgName: org,
        agentName: name,
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
 * PATCH /agents/@:org/:name/access
 * Update agent access level (owner only)
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

      const result = await agentService.updateAgentAccess(org, name, access);

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
 * GET /agents/@:org/:name
 * Get latest version of an agent (public + private with auth)
 */
router.get(
  '/@:org/:name',
  optionalAuth,
  validateParams(agentParamsSchema),
  async (req, res, next) => {
    try {
      const { org, name } = req.params as { org: string; name: string };
      const userId = req.user?.id;

      const agent = await agentService.getAgent(org, name, userId);

      res.status(200).json({
        success: true,
        data: agent,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /agents/@:org/:name/versions
 * List all versions of an agent (public)
 */
router.get(
  '/@:org/:name/versions',
  validateParams(agentParamsSchema),
  async (req, res, next) => {
    try {
      const { org, name } = req.params as { org: string; name: string };

      const versions = await agentService.listAgentVersions(org, name);

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
 * GET /agents/@:org/:name/:version
 * Get specific version of an agent (public + private with auth)
 */
router.get(
  '/@:org/:name/:version',
  optionalAuth,
  validateParams(agentVersionParamsSchema),
  async (req, res, next) => {
    try {
      const { org, name, version } = req.params as { org: string; name: string; version: string };
      const userId = req.user?.id;

      const agent = await agentService.getAgentVersion(org, name, version, userId);

      res.status(200).json({
        success: true,
        data: agent,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /agents/@:org
 * List all agents in an organization (public)
 */
router.get('/@:org', async (req, res, next) => {
  try {
    const { org } = req.params;

    const agents = await agentService.listOrgAgents(org);

    res.status(200).json({
      success: true,
      data: agents,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /agents
 * List all agents (public + user's private agents if authenticated)
 */
router.get('/', optionalAuth, async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const agents = await agentService.listAllAgents(userId);

    res.status(200).json({
      success: true,
      data: agents,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
