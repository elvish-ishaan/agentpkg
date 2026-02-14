import { Router } from 'express';
import { invitationService } from '../services/invitation.service.js';
import { orgService } from '../services/org.service.js';
import { validateBody } from '../middleware/validation.js';
import { requireAuth } from '../middleware/auth.js';
import { z } from 'zod';
import { NotFoundError, ForbiddenError } from '../utils/errors.js';

const router = Router();

// Validation schemas
const createInvitationSchema = z.object({
  email: z.string().email(),
  role: z.enum(['owner', 'member']).optional(),
});

const acceptInvitationSchema = z.object({
  token: z.string().min(1),
});

/**
 * POST /invitations/accept
 * Accept an invitation
 * NOTE: This must come BEFORE /:org route to avoid matching "accept" as an org name
 */
router.post(
  '/accept',
  requireAuth,
  validateBody(acceptInvitationSchema),
  async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { token } = req.body;

      const result = await invitationService.acceptInvitation({
        token,
        userId: req.user.id,
      });

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
 * POST /invitations/:org
 * Create a new invitation (owner only)
 */
router.post(
  '/:org',
  requireAuth,
  validateBody(createInvitationSchema),
  async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { org } = req.params;
      const { email, role } = req.body;

      // Get org
      const orgData = await orgService.getOrgByName(org);
      if (!orgData) {
        throw new NotFoundError('Organization not found');
      }

      // Check if user is owner
      const isOwner = await orgService.hasRole(org, req.user.id, 'owner');
      if (!isOwner) {
        throw new ForbiddenError('Only organization owners can send invitations');
      }

      // Create invitation
      const invitation = await invitationService.createInvitation({
        orgId: orgData.id,
        email,
        role,
        invitedBy: req.user.id,
      });

      res.status(201).json({
        success: true,
        data: invitation,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /invitations/:org
 * List pending invitations for an organization (member access)
 */
router.get('/:org', requireAuth, async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { org } = req.params;

    const invitations = await invitationService.listOrgInvitations(
      org,
      req.user.id
    );

    res.status(200).json({
      success: true,
      data: invitations,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /invitations/:id
 * Cancel an invitation (owner only)
 */
router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id } = req.params;

    const result = await invitationService.cancelInvitation(id, req.user.id);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
