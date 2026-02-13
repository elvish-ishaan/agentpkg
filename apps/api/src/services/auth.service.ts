import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { getEnv } from '../config/env.js';
import { generateToken, hashToken } from '../utils/crypto.js';
import { UnauthorizedError, ConflictError, BadRequestError } from '../utils/errors.js';

const prisma = new PrismaClient();

export interface RegisterInput {
  email: string;
  username: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export class AuthService {
  /**
   * Register a new user with a default org
   */
  async register(input: RegisterInput) {
    const { email, username, password } = input;

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      if (existingUser.email === email) {
        throw new ConflictError('Email already registered');
      }
      if (existingUser.username === username) {
        throw new ConflictError('Username already taken');
      }
    }

    // Check if org name is available
    const existingOrg = await prisma.org.findUnique({
      where: { name: username },
    });

    if (existingOrg) {
      throw new ConflictError('Organization name already taken');
    }

    // Hash password
    const env = getEnv();
    const hashedPassword = await bcrypt.hash(password, env.BCRYPT_ROUNDS);

    // Create user, org, and membership in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create user
      const user = await tx.user.create({
        data: {
          email,
          username,
          password: hashedPassword,
        },
      });

      // Create default org
      const org = await tx.org.create({
        data: {
          name: username,
          ownerId: user.id,
        },
      });

      // Add user as org owner
      await tx.orgMember.create({
        data: {
          orgId: org.id,
          userId: user.id,
          role: 'owner',
        },
      });

      return { user, org };
    });

    // Generate API token
    const token = generateToken();
    const tokenHash = hashToken(token);

    await prisma.apiToken.create({
      data: {
        userId: result.user.id,
        tokenHash,
        name: 'Default token',
      },
    });

    return {
      user: {
        id: result.user.id,
        email: result.user.email,
        username: result.user.username,
      },
      org: {
        id: result.org.id,
        name: result.org.name,
      },
      token,
    };
  }

  /**
   * Login user and return API token
   */
  async login(input: LoginInput) {
    const { email, password } = input;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new UnauthorizedError('Invalid credentials');
    }

    // Generate new API token
    const token = generateToken();
    const tokenHash = hashToken(token);

    await prisma.apiToken.create({
      data: {
        userId: user.id,
        tokenHash,
        name: 'Login token',
      },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
      token,
    };
  }

  /**
   * Validate API token and return user
   */
  async validateToken(token: string) {
    if (!token) {
      throw new UnauthorizedError('No token provided');
    }

    const tokenHash = hashToken(token);

    const apiToken = await prisma.apiToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    if (!apiToken) {
      throw new UnauthorizedError('Invalid token');
    }

    // Check if token is expired
    if (apiToken.expiresAt && apiToken.expiresAt < new Date()) {
      throw new UnauthorizedError('Token expired');
    }

    // Update last used timestamp
    await prisma.apiToken.update({
      where: { id: apiToken.id },
      data: { lastUsedAt: new Date() },
    });

    return {
      user: apiToken.user,
      tokenId: apiToken.id,
    };
  }

  /**
   * Create additional API token for authenticated user
   */
  async createToken(userId: string, name?: string) {
    const token = generateToken();
    const tokenHash = hashToken(token);

    const apiToken = await prisma.apiToken.create({
      data: {
        userId,
        tokenHash,
        name: name || 'API token',
      },
    });

    return {
      id: apiToken.id,
      token,
      name: apiToken.name,
      createdAt: apiToken.createdAt,
    };
  }

  /**
   * Revoke API token
   */
  async revokeToken(tokenId: string, userId: string) {
    const apiToken = await prisma.apiToken.findUnique({
      where: { id: tokenId },
    });

    if (!apiToken) {
      throw new BadRequestError('Token not found');
    }

    if (apiToken.userId !== userId) {
      throw new UnauthorizedError('Not authorized to revoke this token');
    }

    await prisma.apiToken.delete({
      where: { id: tokenId },
    });

    return { success: true };
  }

  /**
   * List user's API tokens
   */
  async listTokens(userId: string) {
    const tokens = await prisma.apiToken.findMany({
      where: { userId },
      select: {
        id: true,
        name: true,
        lastUsedAt: true,
        createdAt: true,
        expiresAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return tokens;
  }
}

export const authService = new AuthService();
