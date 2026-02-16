import { PrismaClient } from '@prisma/client';
import { NotFoundError, ConflictError, BadRequestError, ForbiddenError } from '../utils/errors.js';
import { isValidName, isValidSemver, calculateChecksum } from '../utils/crypto.js';
import { storageService } from './storage.service.js';
import { logger } from '../utils/logger.js';

const prisma = new PrismaClient();

export interface PublishAgentInput {
  orgName: string;
  agentName: string;
  version: string;
  content: string;
  description?: string;
  publishedBy: string;
  access?: 'PRIVATE' | 'PUBLIC';
}

export class AgentService {
  /**
   * Publish a new agent version
   */
  async publishAgent(input: PublishAgentInput) {
    const { orgName, agentName, version, content, description, publishedBy, access } = input;

    // Validate agent name
    if (!isValidName(agentName)) {
      throw new BadRequestError(
        'Invalid agent name. Must be 2-50 characters, lowercase letters, numbers, and hyphens only.'
      );
    }

    // Validate version
    if (!isValidSemver(version)) {
      throw new BadRequestError('Invalid version format. Must be semver (e.g., 0.1.0)');
    }

    // Validate content size (200KB limit)
    const contentSize = Buffer.byteLength(content, 'utf8');
    if (contentSize > 200 * 1024) {
      throw new BadRequestError('Agent file size exceeds 200KB limit');
    }

    // Calculate checksum
    const checksum = calculateChecksum(content);

    // Get org
    const org = await prisma.org.findUnique({
      where: { name: orgName },
    });

    if (!org) {
      throw new NotFoundError('Organization not found');
    }

    // Get or create agent
    let agent = await prisma.agent.findFirst({
      where: {
        orgId: org.id,
        name: agentName,
      },
    });

    if (!agent) {
      agent = await prisma.agent.create({
        data: {
          name: agentName,
          orgId: org.id,
          description,
          access: access || 'PRIVATE',
        },
      });
    }

    // Check if version already exists
    const existingVersion = await prisma.agentVersion.findFirst({
      where: {
        agentId: agent.id,
        version,
      },
    });

    if (existingVersion) {
      throw new ConflictError(`Version ${version} already exists for this agent`);
    }

    // Upload to GCS
    const gcsPath = `${orgName}/${agentName}/${version}/agent.agent.md`;
    await storageService.uploadFile(gcsPath, content);

    // Create version record and update agent in transaction
    const result = await prisma.$transaction(async (tx) => {
      const agentVersion = await tx.agentVersion.create({
        data: {
          agentId: agent.id,
          version,
          content,
          checksum,
          gcsPath,
          publishedBy,
        },
      });

      // Update agent's latest version
      await tx.agent.update({
        where: { id: agent.id },
        data: {
          latestVersion: version,
          description: description || agent.description,
          updatedAt: new Date(),
        },
      });

      return agentVersion;
    });

    return {
      org: orgName,
      agent: agentName,
      version: result.version,
      checksum: result.checksum,
      gcsPath: result.gcsPath,
      publishedAt: result.createdAt,
    };
  }

  /**
   * Update agent access level
   */
  async updateAgentAccess(
    orgName: string,
    agentName: string,
    access: 'PRIVATE' | 'PUBLIC'
  ) {
    const agent = await prisma.agent.findFirst({
      where: {
        org: { name: orgName },
        name: agentName
      },
    });

    if (!agent) {
      throw new NotFoundError('Agent not found');
    }

    return await prisma.agent.update({
      where: { id: agent.id },
      data: { access },
    });
  }

  /**
   * Get agent with latest version
   */
  async getAgent(orgName: string, agentName: string, userId?: string) {
    const agent = await prisma.agent.findFirst({
      where: {
        org: { name: orgName },
        name: agentName,
      },
      include: {
        org: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!agent) {
      throw new NotFoundError('Agent not found');
    }

    // Access control check
    if (agent.access === 'PRIVATE') {
      if (!userId) {
        throw new ForbiddenError('This agent is private');
      }

      const isMember = await prisma.orgMember.findFirst({
        where: {
          orgId: agent.orgId,
          userId,
        },
      });

      if (!isMember) {
        throw new ForbiddenError('You do not have access to this agent');
      }
    }

    if (!agent.latestVersion) {
      throw new NotFoundError('No versions published for this agent');
    }

    // Get latest version
    const latestVersion = await prisma.agentVersion.findFirst({
      where: {
        agentId: agent.id,
        version: agent.latestVersion,
      },
    });

    if (!latestVersion) {
      throw new NotFoundError('Latest version not found');
    }

    // Generate signed URL (but make it optional for development)
    let downloadUrl = '';
    try {
      downloadUrl = await storageService.getSignedUrl(latestVersion.gcsPath);
    } catch (error) {
      // GCS might not be configured in development, fallback to content
      logger.warn({ error }, 'Failed to generate signed URL, will use content directly');
    }

    // Return full agent structure with nested objects
    return {
      id: agent.id,
      name: agent.name,
      description: agent.description,
      orgId: agent.orgId,
      downloads: agent.downloads,
      access: agent.access,
      createdAt: agent.createdAt,
      updatedAt: agent.updatedAt,
      org: {
        id: agent.org.name,
        name: agent.org.name,
      },
      latestVersion: {
        id: latestVersion.id,
        agentId: latestVersion.agentId,
        version: latestVersion.version,
        content: latestVersion.content,
        checksum: latestVersion.checksum,
        downloadUrl,
        publishedById: latestVersion.publishedBy || '',
        createdAt: latestVersion.createdAt,
        updatedAt: latestVersion.createdAt,
      },
    };
  }

  /**
   * Get specific agent version
   */
  async getAgentVersion(orgName: string, agentName: string, version: string, userId?: string) {
    const agentVersion = await prisma.agentVersion.findFirst({
      where: {
        agent: {
          org: { name: orgName },
          name: agentName,
        },
        version,
      },
      include: {
        agent: {
          include: {
            org: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    if (!agentVersion) {
      throw new NotFoundError('Agent version not found');
    }

    // Access control check
    if (agentVersion.agent.access === 'PRIVATE') {
      if (!userId) {
        throw new ForbiddenError('This agent is private');
      }

      const isMember = await prisma.orgMember.findFirst({
        where: {
          orgId: agentVersion.agent.orgId,
          userId,
        },
      });

      if (!isMember) {
        throw new ForbiddenError('You do not have access to this agent');
      }
    }

    // Generate signed URL (but make it optional for development)
    let downloadUrl = '';
    try {
      downloadUrl = await storageService.getSignedUrl(agentVersion.gcsPath);
    } catch (error) {
      // GCS might not be configured in development, fallback to content
      logger.warn({ error }, 'Failed to generate signed URL, will use content directly');
    }

    // Return full agent structure with nested objects
    return {
      id: agentVersion.agent.id,
      name: agentVersion.agent.name,
      description: agentVersion.agent.description,
      orgId: agentVersion.agent.orgId,
      downloads: agentVersion.agent.downloads,
      access: agentVersion.agent.access,
      createdAt: agentVersion.agent.createdAt,
      updatedAt: agentVersion.agent.updatedAt,
      org: {
        id: agentVersion.agent.org.name,
        name: agentVersion.agent.org.name,
      },
      latestVersion: {
        id: agentVersion.id,
        agentId: agentVersion.agentId,
        version: agentVersion.version,
        content: agentVersion.content,
        checksum: agentVersion.checksum,
        downloadUrl,
        publishedById: agentVersion.publishedBy || '',
        createdAt: agentVersion.createdAt,
        updatedAt: agentVersion.createdAt,
      },
    };
  }

  /**
   * List all versions of an agent
   */
  async listAgentVersions(orgName: string, agentName: string) {
    const agent = await prisma.agent.findFirst({
      where: {
        org: { name: orgName },
        name: agentName,
      },
      include: {
        versions: {
          orderBy: {
            createdAt: 'desc',
          },
          select: {
            id: true,
            version: true,
            checksum: true,
            createdAt: true,
            publishedBy: true,
          },
        },
      },
    });

    if (!agent) {
      throw new NotFoundError('Agent not found');
    }

    return agent.versions.map((version) => ({
      id: version.id,
      version: version.version,
      checksum: version.checksum,
      createdAt: version.createdAt,
      publishedBy: version.publishedBy,
    }));
  }

  /**
   * List agents in an organization
   */
  async listOrgAgents(orgName: string) {
    const org = await prisma.org.findUnique({
      where: { name: orgName },
      include: {
        agents: {
          orderBy: {
            updatedAt: 'desc',
          },
          include: {
            _count: {
              select: {
                versions: true,
              },
            },
          },
        },
      },
    });

    if (!org) {
      throw new NotFoundError('Organization not found');
    }

    return org.agents.map((agent) => ({
      id: agent.id,
      name: agent.name,
      description: agent.description,
      orgId: agent.orgId,
      createdAt: agent.createdAt,
      updatedAt: agent.updatedAt,
      org: {
        name: orgName,
      },
      latestVersion: agent.latestVersion ? {
        version: agent.latestVersion,
      } : undefined,
      versionCount: agent._count.versions,
    }));
  }

  /**
   * List all agents (public + user's private agents if authenticated)
   */
  async listAllAgents(userId?: string) {
    // Get all public agents
    const publicAgents = await prisma.agent.findMany({
      where: {
        latestVersion: { not: null },
        access: 'PUBLIC',
      },
      orderBy: {
        downloads: 'desc',
      },
      include: {
        org: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            versions: true,
          },
        },
      },
    });

    // If authenticated, also get user's private agents from their orgs
    let privateAgents: any[] = [];
    if (userId) {
      const memberships = await prisma.orgMember.findMany({
        where: { userId },
        select: { orgId: true },
      });

      if (memberships.length > 0) {
        privateAgents = await prisma.agent.findMany({
          where: {
            latestVersion: { not: null },
            access: 'PRIVATE',
            orgId: { in: memberships.map(m => m.orgId) },
          },
          orderBy: {
            downloads: 'desc',
          },
          include: {
            org: {
              select: {
                id: true,
                name: true,
              },
            },
            _count: {
              select: {
                versions: true,
              },
            },
          },
        });
      }
    }

    // Combine and format
    return [...publicAgents, ...privateAgents].map((agent) => ({
      id: agent.id,
      name: agent.name,
      description: agent.description,
      orgId: agent.orgId,
      downloads: agent.downloads || 0,
      access: agent.access,
      createdAt: agent.createdAt,
      updatedAt: agent.updatedAt,
      org: {
        id: agent.org.id,
        name: agent.org.name,
      },
      latestVersion: agent.latestVersion ? {
        version: agent.latestVersion,
      } : undefined,
      versionCount: agent._count.versions,
    }));
  }
}

export const agentService = new AgentService();
