import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import { NotFoundError, BadRequestError, ForbiddenError, ConflictError } from '../utils/errors.js';
import { emailService } from './email.service.js';
import { logger } from '../utils/logger.js';

const prisma = new PrismaClient();

export interface CreateInvitationInput {
  orgId: string;
  email: string;
  role?: string;
  invitedBy: string;
}

export interface AcceptInvitationInput {
  token: string;
  userId: string;
}

export class InvitationService {
  /**
   * Generate a secure random token for invitation
   */
  private generateToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Create a new invitation
   */
  async createInvitation(input: CreateInvitationInput) {
    const { orgId, email, role = 'member', invitedBy } = input;

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new BadRequestError('Invalid email format');
    }

    // Get org with inviter info
    const org = await prisma.org.findUnique({
      where: { id: orgId },
      include: {
        members: {
          where: { userId: invitedBy },
        },
      },
    });

    if (!org) {
      throw new NotFoundError('Organization not found');
    }

    // Check if inviter is a member of the org
    if (org.members.length === 0 && org.ownerId !== invitedBy) {
      throw new ForbiddenError('You are not a member of this organization');
    }

    // Check if user is already a member
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      const existingMember = await prisma.orgMember.findFirst({
        where: {
          orgId,
          userId: existingUser.id,
        },
      });

      if (existingMember) {
        throw new ConflictError('User is already a member of this organization');
      }
    }

    // Check for existing pending invitation
    const existingInvitation = await prisma.orgInvitation.findFirst({
      where: {
        orgId,
        email,
        status: 'PENDING',
      },
    });

    if (existingInvitation) {
      throw new ConflictError('An invitation has already been sent to this email');
    }

    // Generate secure token
    const token = this.generateToken();

    // Set expiration to 7 days from now
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Create invitation
    const invitation = await prisma.orgInvitation.create({
      data: {
        orgId,
        email,
        role,
        token,
        invitedBy,
        expiresAt,
      },
      include: {
        org: true,
        inviter: {
          select: {
            username: true,
            email: true,
          },
        },
      },
    });

    // Generate accept URL
    const baseUrl = process.env.WEB_BASE_URL || 'http://localhost:3000';
    const acceptUrl = `${baseUrl}/invite/accept?token=${token}`;

    // Send invitation email
    try {
      await emailService.sendInvitationEmail({
        to: email,
        orgName: org.name,
        inviterName: invitation.inviter.username,
        acceptUrl,
      });
    } catch (error) {
      logger.error({ error }, 'Failed to send invitation email, but invitation was created');
      // Don't throw - invitation was created successfully
    }

    return {
      id: invitation.id,
      email: invitation.email,
      role: invitation.role,
      status: invitation.status,
      expiresAt: invitation.expiresAt,
      createdAt: invitation.createdAt,
      acceptUrl, // Include for development/testing
    };
  }

  /**
   * Accept an invitation
   */
  async acceptInvitation(input: AcceptInvitationInput) {
    const { token, userId } = input;

    // Find invitation
    const invitation = await prisma.orgInvitation.findUnique({
      where: { token },
      include: {
        org: true,
        inviter: {
          select: {
            email: true,
          },
        },
      },
    });

    if (!invitation) {
      throw new NotFoundError('Invitation not found');
    }

    // Check if already accepted, expired, or cancelled
    if (invitation.status === 'ACCEPTED') {
      throw new BadRequestError('This invitation has already been accepted');
    }

    if (invitation.status === 'EXPIRED' || invitation.status === 'CANCELLED') {
      throw new BadRequestError('This invitation is no longer valid');
    }

    // Check if expired
    if (invitation.expiresAt < new Date()) {
      await prisma.orgInvitation.update({
        where: { id: invitation.id },
        data: { status: 'EXPIRED' },
      });
      throw new BadRequestError('This invitation has expired');
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Verify email matches
    if (user.email !== invitation.email) {
      throw new ForbiddenError(
        'This invitation was sent to a different email address. Please log in with the invited email.'
      );
    }

    // Check if already a member
    const existingMember = await prisma.orgMember.findFirst({
      where: {
        orgId: invitation.orgId,
        userId,
      },
    });

    if (existingMember) {
      // Mark as accepted anyway
      await prisma.orgInvitation.update({
        where: { id: invitation.id },
        data: { status: 'ACCEPTED' },
      });
      throw new ConflictError('You are already a member of this organization');
    }

    // Add user to organization and mark invitation as accepted
    await prisma.$transaction([
      prisma.orgMember.create({
        data: {
          orgId: invitation.orgId,
          userId,
          role: invitation.role,
        },
      }),
      prisma.orgInvitation.update({
        where: { id: invitation.id },
        data: { status: 'ACCEPTED' },
      }),
    ]);

    // Send notification to inviter
    try {
      await emailService.sendInvitationAcceptedEmail({
        to: invitation.inviter.email,
        orgName: invitation.org.name,
        memberName: user.username,
        memberEmail: user.email,
      });
    } catch (error) {
      logger.error({ error }, 'Failed to send invitation accepted notification');
      // Don't throw - user was added successfully
    }

    return {
      orgId: invitation.orgId,
      orgName: invitation.org.name,
      message: 'Successfully joined organization',
    };
  }

  /**
   * Cancel an invitation (owner only)
   */
  async cancelInvitation(invitationId: string, userId: string) {
    const invitation = await prisma.orgInvitation.findUnique({
      where: { id: invitationId },
      include: {
        org: true,
      },
    });

    if (!invitation) {
      throw new NotFoundError('Invitation not found');
    }

    // Check if user is org owner
    if (invitation.org.ownerId !== userId) {
      throw new ForbiddenError('Only the organization owner can cancel invitations');
    }

    // Check if already accepted or expired
    if (invitation.status === 'ACCEPTED') {
      throw new BadRequestError('Cannot cancel an accepted invitation');
    }

    if (invitation.status === 'CANCELLED') {
      throw new BadRequestError('This invitation has already been cancelled');
    }

    // Cancel invitation
    await prisma.orgInvitation.update({
      where: { id: invitationId },
      data: { status: 'CANCELLED' },
    });

    return {
      message: 'Invitation cancelled successfully',
    };
  }

  /**
   * List pending invitations for an organization
   */
  async listOrgInvitations(orgName: string, userId: string) {
    // Get org
    const org = await prisma.org.findUnique({
      where: { name: orgName },
    });

    if (!org) {
      throw new NotFoundError('Organization not found');
    }

    // Check if user is a member
    const isMember = await prisma.orgMember.findFirst({
      where: {
        orgId: org.id,
        userId,
      },
    });

    if (!isMember && org.ownerId !== userId) {
      throw new ForbiddenError('You do not have access to this organization');
    }

    // Get pending invitations
    const invitations = await prisma.orgInvitation.findMany({
      where: {
        orgId: org.id,
        status: 'PENDING',
      },
      include: {
        inviter: {
          select: {
            username: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return invitations.map((inv) => ({
      id: inv.id,
      email: inv.email,
      role: inv.role,
      status: inv.status,
      invitedBy: inv.inviter.username,
      expiresAt: inv.expiresAt,
      createdAt: inv.createdAt,
    }));
  }
}

export const invitationService = new InvitationService();
