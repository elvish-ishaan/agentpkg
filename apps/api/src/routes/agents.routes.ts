import { Router } from 'express';
import { agentService } from '../services/agent.service.js';
import { orgService } from '../services/org.service.js';
import { validateBody, validateParams } from '../middleware/validation.js';
import { requireAuth } from '../middleware/auth.js';
import { createPublishLimiter } from '../middleware/rate-limit.js';
import {
  publishAgentSchema,
  agentParamsSchema,
  agentVersionParamsSchema,
} from '../validators/agent.validator.js';
import { ForbiddenError } from '../utils/errors.js';
import { calculateChecksum } from '../utils/crypto.js';

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

      const { org, name, version, content, description, checksum } = req.body;

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
 * GET /agents/@:org/:name
 * Get latest version of an agent (public)
 */
router.get(
  '/@:org/:name',
  validateParams(agentParamsSchema),
  async (req, res, next) => {
    try {
      const { org, name } = req.params as { org: string; name: string };

      const agent = await agentService.getAgent(org, name);

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
 * Get specific version of an agent (public)
 */
router.get(
  '/@:org/:name/:version',
  validateParams(agentVersionParamsSchema),
  async (req, res, next) => {
    try {
      const { org, name, version } = req.params as { org: string; name: string; version: string };

      const agent = await agentService.getAgentVersion(org, name, version);

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

export default router;
