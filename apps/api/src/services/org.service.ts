import { PrismaClient } from '@prisma/client';
import { ConflictError, NotFoundError, ForbiddenError, BadRequestError } from '../utils/errors.js';
import { isValidName } from '../utils/crypto.js';

const prisma = new PrismaClient();

export interface CreateOrgInput {
  name: string;
  userId: string;
}

export class OrgService {
  /**
   * Create a new organization
   */
  async createOrg(input: CreateOrgInput) {
    const { name, userId } = input;

    // Validate org name
    if (!isValidName(name)) {
      throw new BadRequestError(
        'Invalid org name. Must be 2-50 characters, lowercase letters, numbers, and hyphens only.'
      );
    }

    // Check if org already exists
    const existing = await prisma.org.findUnique({
      where: { name },
    });

    if (existing) {
      throw new ConflictError('Organization name already taken');
    }

    // Create org and add user as owner in transaction
    const result = await prisma.$transaction(async (tx) => {
      const org = await tx.org.create({
        data: {
          name,
          ownerId: userId,
        },
      });

      await tx.orgMember.create({
        data: {
          orgId: org.id,
          userId,
          role: 'owner',
        },
      });

      return org;
    });

    return result;
  }

  /**
   * Get user's organizations
   */
  async getUserOrgs(userId: string) {
    const memberships = await prisma.orgMember.findMany({
      where: { userId },
      include: {
        org: {
          include: {
            _count: {
              select: {
                members: true,
                agents: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return memberships.map((m) => ({
      id: m.org.id,
      name: m.org.name,
      role: m.role,
      memberCount: m.org._count.members,
      agentCount: m.org._count.agents,
      createdAt: m.org.createdAt,
    }));
  }

  /**
   * Get organization details by name
   */
  async getOrgByName(name: string, userId?: string) {
    const org = await prisma.org.findUnique({
      where: { name },
      include: {
        owner: {
          select: {
            id: true,
            username: true,
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                email: true,
              },
            },
          },
        },
        _count: {
          select: {
            agents: true,
          },
        },
      },
    });

    if (!org) {
      throw new NotFoundError('Organization not found');
    }

    // If userId provided, check if user is a member
    if (userId) {
      const isMember = org.members.some((m) => m.userId === userId);
      if (!isMember) {
        throw new ForbiddenError('You are not a member of this organization');
      }
    }

    return {
      id: org.id,
      name: org.name,
      ownerId: org.ownerId,
      owner: org.owner,
      members: org.members.map((m) => ({
        id: m.id,
        user: m.user,
        role: m.role,
        joinedAt: m.createdAt,
      })),
      agentCount: org._count.agents,
      createdAt: org.createdAt,
    };
  }

  /**
   * Add member to organization
   */
  async addMember(orgName: string, userIdToAdd: string, requesterId: string) {
    // Get org
    const org = await prisma.org.findUnique({
      where: { name: orgName },
      include: {
        members: true,
      },
    });

    if (!org) {
      throw new NotFoundError('Organization not found');
    }

    // Check if requester is owner
    const requesterMembership = org.members.find((m) => m.userId === requesterId);
    if (!requesterMembership || requesterMembership.role !== 'owner') {
      throw new ForbiddenError('Only organization owners can add members');
    }

    // Check if user is already a member
    const existingMember = org.members.find((m) => m.userId === userIdToAdd);
    if (existingMember) {
      throw new ConflictError('User is already a member of this organization');
    }

    // Add member
    const membership = await prisma.orgMember.create({
      data: {
        orgId: org.id,
        userId: userIdToAdd,
        role: 'member',
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });

    return {
      id: membership.id,
      user: membership.user,
      role: membership.role,
      joinedAt: membership.createdAt,
    };
  }

  /**
   * Check if user is member of org
   */
  async isMember(orgName: string, userId: string): Promise<boolean> {
    const membership = await prisma.orgMember.findFirst({
      where: {
        org: { name: orgName },
        userId,
      },
    });

    return !!membership;
  }

  /**
   * Check if user has specific role in org
   */
  async hasRole(orgName: string, userId: string, role: 'owner' | 'member'): Promise<boolean> {
    const membership = await prisma.orgMember.findFirst({
      where: {
        org: { name: orgName },
        userId,
      },
    });

    if (!membership) return false;

    if (role === 'owner') {
      return membership.role === 'owner';
    }

    return true; // All members have 'member' role (owners are also members)
  }

  /**
   * Get org ID by name
   */
  async getOrgIdByName(name: string): Promise<string> {
    const org = await prisma.org.findUnique({
      where: { name },
      select: { id: true },
    });

    if (!org) {
      throw new NotFoundError('Organization not found');
    }

    return org.id;
  }
}

export const orgService = new OrgService();
