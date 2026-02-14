import { PrismaClient } from '@prisma/client';
import { NotFoundError, ConflictError, BadRequestError } from '../utils/errors.js';
import { isValidName, isValidSemver, calculateChecksum } from '../utils/crypto.js';
import { storageService } from './storage.service.js';

const prisma = new PrismaClient();

export interface PublishAgentInput {
  orgName: string;
  agentName: string;
  version: string;
  content: string;
  description?: string;
  publishedBy: string;
}

export class AgentService {
  /**
   * Publish a new agent version
   */
  async publishAgent(input: PublishAgentInput) {
    const { orgName, agentName, version, content, description, publishedBy } = input;

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
   * Get agent with latest version
   */
  async getAgent(orgName: string, agentName: string) {
    const agent = await prisma.agent.findFirst({
      where: {
        org: { name: orgName },
        name: agentName,
      },
      include: {
        org: {
          select: {
            id: true,
            name: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    if (!agent) {
      throw new NotFoundError('Agent not found');
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

    // Generate signed URL
    const downloadUrl = await storageService.getSignedUrl(latestVersion.gcsPath);

    return {
      id: agent.id,
      name: agent.name,
      description: agent.description,
      orgId: agent.orgId,
      downloads: agent.downloads || 0,
      createdAt: agent.createdAt,
      updatedAt: agent.updatedAt,
      org: {
        id: agent.org.id,
        name: agent.org.name,
        createdAt: agent.org.createdAt,
        updatedAt: agent.org.updatedAt,
      },
      latestVersion: {
        id: latestVersion.id,
        version: latestVersion.version,
        content: latestVersion.content,
        checksum: latestVersion.checksum,
        gcsPath: latestVersion.gcsPath,
        downloadUrl,
        createdAt: latestVersion.createdAt,
        publishedBy: latestVersion.publishedBy,
      },
    };
  }

  /**
   * Get specific agent version
   */
  async getAgentVersion(orgName: string, agentName: string, version: string) {
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

    // Generate signed URL
    const downloadUrl = await storageService.getSignedUrl(agentVersion.gcsPath);

    return {
      org: agentVersion.agent.org.name,
      name: agentVersion.agent.name,
      description: agentVersion.agent.description,
      version: agentVersion.version,
      checksum: agentVersion.checksum,
      downloadUrl,
      publishedAt: agentVersion.createdAt,
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
   * List all public agents (agents with at least one published version)
   */
  async listAllAgents() {
    const agents = await prisma.agent.findMany({
      where: {
        latestVersion: {
          not: null,
        },
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

    return agents.map((agent) => ({
      id: agent.id,
      name: agent.name,
      description: agent.description,
      orgId: agent.orgId,
      downloads: agent.downloads || 0,
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
