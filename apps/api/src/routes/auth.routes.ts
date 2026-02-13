import { Router } from 'express';
import { authService } from '../services/auth.service.js';
import { validateBody } from '../middleware/validation.js';
import { requireAuth } from '../middleware/auth.js';
import { createAuthLimiter } from '../middleware/rate-limit.js';
import {
  registerSchema,
  loginSchema,
  createTokenSchema,
  revokeTokenSchema,
} from '../validators/auth.validator.js';

const router = Router();
const authLimiter = createAuthLimiter();

/**
 * POST /auth/register
 * Register a new user
 */
router.post(
  '/register',
  authLimiter,
  validateBody(registerSchema),
  async (req, res, next) => {
    try {
      const result = await authService.register(req.body);

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
 * POST /auth/login
 * Login user and return API token
 */
router.post(
  '/login',
  authLimiter,
  validateBody(loginSchema),
  async (req, res, next) => {
    try {
      const result = await authService.login(req.body);

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
 * POST /auth/token
 * Create additional API token (requires auth)
 */
router.post(
  '/token',
  requireAuth,
  validateBody(createTokenSchema),
  async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const result = await authService.createToken(req.user.id, req.body.name);

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
 * GET /auth/tokens
 * List user's API tokens (requires auth)
 */
router.get('/tokens', requireAuth, async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const tokens = await authService.listTokens(req.user.id);

    res.status(200).json({
      success: true,
      data: { tokens },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /auth/token
 * Revoke API token (requires auth)
 */
router.delete(
  '/token',
  requireAuth,
  validateBody(revokeTokenSchema),
  async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      await authService.revokeToken(req.body.tokenId, req.user.id);

      res.status(200).json({
        success: true,
        message: 'Token revoked successfully',
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /auth/me
 * Get current user info (requires auth)
 */
router.get('/me', requireAuth, async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    res.status(200).json({
      success: true,
      data: {
        id: req.user.id,
        email: req.user.email,
        username: req.user.username,
        createdAt: req.user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
