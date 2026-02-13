import { Router } from 'express';
import { orgService } from '../services/org.service.js';
import { validateBody } from '../middleware/validation.js';
import { requireAuth, requireOrgMember, requireOrgOwner } from '../middleware/auth.js';
import { orgNameSchema, addMemberSchema } from '../validators/agent.validator.js';

const router = Router();

/**
 * POST /orgs
 * Create a new organization (requires auth)
 */
router.post(
  '/',
  requireAuth,
  validateBody(orgNameSchema),
  async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const org = await orgService.createOrg({
        name: req.body.name,
        userId: req.user.id,
      });

      res.status(201).json({
        success: true,
        data: {
          id: org.id,
          name: org.name,
          createdAt: org.createdAt,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /orgs
 * List user's organizations (requires auth)
 */
router.get('/', requireAuth, async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const orgs = await orgService.getUserOrgs(req.user.id);

    res.status(200).json({
      success: true,
      data: orgs,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /orgs/:org
 * Get organization details (requires membership)
 */
router.get(
  '/:org',
  requireAuth,
  requireOrgMember('org'),
  async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const org = await orgService.getOrgByName(req.params.org as string, req.user.id);

      res.status(200).json({
        success: true,
        data: org,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /orgs/:org/members
 * Add member to organization (requires owner)
 */
router.post(
  '/:org/members',
  requireAuth,
  requireOrgOwner('org'),
  validateBody(addMemberSchema),
  async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const member = await orgService.addMember(
        req.params.org as string,
        req.body.userId,
        req.user.id
      );

      res.status(201).json({
        success: true,
        data: member,
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
