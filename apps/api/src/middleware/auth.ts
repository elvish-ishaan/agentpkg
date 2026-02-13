import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service.js';
import { orgService } from '../services/org.service.js';
import { UnauthorizedError, ForbiddenError } from '../utils/errors.js';

/**
 * Middleware to require authentication
 */
export async function requireAuth(req: Request, _res: Response, next: NextFunction) {
  try {
    let token: string | undefined;

    // Check Authorization header first
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7); // Remove 'Bearer ' prefix
    }

    // Fallback to cookie if no Authorization header
    if (!token && req.cookies?.auth_token) {
      token = req.cookies.auth_token;
    }

    if (!token) {
      throw new UnauthorizedError('No token provided');
    }

    const { user, tokenId } = await authService.validateToken(token);

    // Attach user to request
    req.user = user;
    req.tokenId = tokenId;

    next();
  } catch (error) {
    next(error);
  }
}

/**
 * Middleware to require org membership
 */
export function requireOrgMember(orgParam: string = 'org') {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Authentication required');
      }

      const orgName = req.params[orgParam] as string;
      if (!orgName) {
        throw new ForbiddenError('Organization name required');
      }

      const isMember = await orgService.isMember(orgName, req.user.id);
      if (!isMember) {
        throw new ForbiddenError('You are not a member of this organization');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}

/**
 * Middleware to require org owner role
 */
export function requireOrgOwner(orgParam: string = 'org') {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Authentication required');
      }

      const orgName = req.params[orgParam] as string;
      if (!orgName) {
        throw new ForbiddenError('Organization name required');
      }

      const isOwner = await orgService.hasRole(orgName, req.user.id, 'owner');
      if (!isOwner) {
        throw new ForbiddenError('Only organization owners can perform this action');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}
