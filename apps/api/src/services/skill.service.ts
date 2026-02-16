import { PrismaClient } from '@prisma/client';
import { NotFoundError, ConflictError, BadRequestError, ForbiddenError } from '../utils/errors.js';
import { isValidName, isValidSemver, calculateChecksum } from '../utils/crypto.js';
import { storageService } from './storage.service.js';
import { logger } from '../utils/logger.js';

const prisma = new PrismaClient();

export interface PublishSkillInput {
  orgName: string;
  skillName: string;
  version: string;
  content: string;
  description?: string;
  publishedBy: string;
  access?: 'PRIVATE' | 'PUBLIC';
}

export class SkillService {
  /**
   * Publish a new skill version
   */
  async publishSkill(input: PublishSkillInput) {
    const { orgName, skillName, version, content, description, publishedBy, access } = input;

    // Validate skill name
    if (!isValidName(skillName)) {
      throw new BadRequestError(
        'Invalid skill name. Must be 2-50 characters, lowercase letters, numbers, and hyphens only.'
      );
    }

    // Validate version
    if (!isValidSemver(version)) {
      throw new BadRequestError('Invalid version format. Must be semver (e.g., 0.1.0)');
    }

    // Validate content size (200KB limit)
    const contentSize = Buffer.byteLength(content, 'utf8');
    if (contentSize > 200 * 1024) {
      throw new BadRequestError('Skill file size exceeds 200KB limit');
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

    // Get or create skill
    let skill = await prisma.skill.findFirst({
      where: {
        orgId: org.id,
        name: skillName,
      },
    });

    if (!skill) {
      skill = await prisma.skill.create({
        data: {
          name: skillName,
          orgId: org.id,
          description,
          access: access || 'PRIVATE',
        },
      });
    }

    // Check if version already exists
    const existingVersion = await prisma.skillVersion.findFirst({
      where: {
        skillId: skill.id,
        version,
      },
    });

    if (existingVersion) {
      throw new ConflictError(`Version ${version} already exists for this skill`);
    }

    // Upload to GCS
    const gcsPath = `${orgName}/${skillName}/${version}/skill.skill.md`;
    await storageService.uploadFile(gcsPath, content);

    // Create version record and update skill in transaction
    const result = await prisma.$transaction(async (tx) => {
      const skillVersion = await tx.skillVersion.create({
        data: {
          skillId: skill.id,
          version,
          content,
          checksum,
          gcsPath,
          publishedBy,
        },
      });

      // Update skill's latest version
      await tx.skill.update({
        where: { id: skill.id },
        data: {
          latestVersion: version,
          description: description || skill.description,
          updatedAt: new Date(),
        },
      });

      return skillVersion;
    });

    return {
      org: orgName,
      skill: skillName,
      version: result.version,
      checksum: result.checksum,
      gcsPath: result.gcsPath,
      publishedAt: result.createdAt,
    };
  }

  /**
   * Update skill access level
   */
  async updateSkillAccess(
    orgName: string,
    skillName: string,
    access: 'PRIVATE' | 'PUBLIC'
  ) {
    const skill = await prisma.skill.findFirst({
      where: {
        org: { name: orgName },
        name: skillName
      },
    });

    if (!skill) {
      throw new NotFoundError('Skill not found');
    }

    return await prisma.skill.update({
      where: { id: skill.id },
      data: { access },
    });
  }

  /**
   * Get skill with latest version
   */
  async getSkill(orgName: string, skillName: string, userId?: string) {
    const skill = await prisma.skill.findFirst({
      where: {
        org: { name: orgName },
        name: skillName,
      },
      include: {
        org: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!skill) {
      throw new NotFoundError('Skill not found');
    }

    // Access control check
    if (skill.access === 'PRIVATE') {
      if (!userId) {
        throw new ForbiddenError('This skill is private');
      }

      const isMember = await prisma.orgMember.findFirst({
        where: {
          orgId: skill.orgId,
          userId,
        },
      });

      if (!isMember) {
        throw new ForbiddenError('You do not have access to this skill');
      }
    }

    if (!skill.latestVersion) {
      throw new NotFoundError('No versions published for this skill');
    }

    // Get latest version
    const latestVersion = await prisma.skillVersion.findFirst({
      where: {
        skillId: skill.id,
        version: skill.latestVersion,
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

    // Return full skill structure with nested objects
    return {
      id: skill.id,
      name: skill.name,
      description: skill.description,
      orgId: skill.orgId,
      downloads: skill.downloads,
      access: skill.access,
      createdAt: skill.createdAt,
      updatedAt: skill.updatedAt,
      org: {
        id: skill.org.name,
        name: skill.org.name,
      },
      latestVersion: {
        id: latestVersion.id,
        skillId: latestVersion.skillId,
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
   * Get specific skill version
   */
  async getSkillVersion(orgName: string, skillName: string, version: string, userId?: string) {
    const skillVersion = await prisma.skillVersion.findFirst({
      where: {
        skill: {
          org: { name: orgName },
          name: skillName,
        },
        version,
      },
      include: {
        skill: {
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

    if (!skillVersion) {
      throw new NotFoundError('Skill version not found');
    }

    // Access control check
    if (skillVersion.skill.access === 'PRIVATE') {
      if (!userId) {
        throw new ForbiddenError('This skill is private');
      }

      const isMember = await prisma.orgMember.findFirst({
        where: {
          orgId: skillVersion.skill.orgId,
          userId,
        },
      });

      if (!isMember) {
        throw new ForbiddenError('You do not have access to this skill');
      }
    }

    // Generate signed URL (but make it optional for development)
    let downloadUrl = '';
    try {
      downloadUrl = await storageService.getSignedUrl(skillVersion.gcsPath);
    } catch (error) {
      // GCS might not be configured in development, fallback to content
      logger.warn({ error }, 'Failed to generate signed URL, will use content directly');
    }

    // Return full skill structure with nested objects
    return {
      id: skillVersion.skill.id,
      name: skillVersion.skill.name,
      description: skillVersion.skill.description,
      orgId: skillVersion.skill.orgId,
      downloads: skillVersion.skill.downloads,
      access: skillVersion.skill.access,
      createdAt: skillVersion.skill.createdAt,
      updatedAt: skillVersion.skill.updatedAt,
      org: {
        id: skillVersion.skill.org.name,
        name: skillVersion.skill.org.name,
      },
      latestVersion: {
        id: skillVersion.id,
        skillId: skillVersion.skillId,
        version: skillVersion.version,
        content: skillVersion.content,
        checksum: skillVersion.checksum,
        downloadUrl,
        publishedById: skillVersion.publishedBy || '',
        createdAt: skillVersion.createdAt,
        updatedAt: skillVersion.createdAt,
      },
    };
  }

  /**
   * List all versions of a skill
   */
  async listSkillVersions(orgName: string, skillName: string) {
    const skill = await prisma.skill.findFirst({
      where: {
        org: { name: orgName },
        name: skillName,
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

    if (!skill) {
      throw new NotFoundError('Skill not found');
    }

    return skill.versions.map((version) => ({
      id: version.id,
      version: version.version,
      checksum: version.checksum,
      createdAt: version.createdAt,
      publishedBy: version.publishedBy,
    }));
  }

  /**
   * List skills in an organization
   */
  async listOrgSkills(orgName: string) {
    const org = await prisma.org.findUnique({
      where: { name: orgName },
      include: {
        skills: {
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

    return org.skills.map((skill) => ({
      id: skill.id,
      name: skill.name,
      description: skill.description,
      orgId: skill.orgId,
      createdAt: skill.createdAt,
      updatedAt: skill.updatedAt,
      org: {
        name: orgName,
      },
      latestVersion: skill.latestVersion ? {
        version: skill.latestVersion,
      } : undefined,
      versionCount: skill._count.versions,
    }));
  }

  /**
   * List all skills (public + user's private skills if authenticated)
   */
  async listAllSkills(userId?: string) {
    // Get all public skills
    const publicSkills = await prisma.skill.findMany({
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

    // If authenticated, also get user's private skills from their orgs
    let privateSkills: any[] = [];
    if (userId) {
      const memberships = await prisma.orgMember.findMany({
        where: { userId },
        select: { orgId: true },
      });

      if (memberships.length > 0) {
        privateSkills = await prisma.skill.findMany({
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
    return [...publicSkills, ...privateSkills].map((skill) => ({
      id: skill.id,
      name: skill.name,
      description: skill.description,
      orgId: skill.orgId,
      downloads: skill.downloads || 0,
      access: skill.access,
      createdAt: skill.createdAt,
      updatedAt: skill.updatedAt,
      org: {
        id: skill.org.id,
        name: skill.org.name,
      },
      latestVersion: skill.latestVersion ? {
        version: skill.latestVersion,
      } : undefined,
      versionCount: skill._count.versions,
    }));
  }
}

export const skillService = new SkillService();
