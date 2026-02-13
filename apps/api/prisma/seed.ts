import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  // Clean up existing data (in development only)
  if (process.env.NODE_ENV === 'development') {
    await prisma.apiToken.deleteMany();
    await prisma.agentVersion.deleteMany();
    await prisma.agent.deleteMany();
    await prisma.orgMember.deleteMany();
    await prisma.org.deleteMany();
    await prisma.user.deleteMany();
    console.log('Cleared existing data');
  }

  // Create test user
  const hashedPassword = await bcrypt.hash('testpassword123', 10);
  const testUser = await prisma.user.create({
    data: {
      email: 'test@agentpkg.dev',
      username: 'testuser',
      password: hashedPassword,
    },
  });
  console.log('Created test user:', testUser.username);

  // Create default org for test user
  const testOrg = await prisma.org.create({
    data: {
      name: 'testuser',
      ownerId: testUser.id,
    },
  });
  console.log('Created test org:', testOrg.name);

  // Add user as owner of the org
  await prisma.orgMember.create({
    data: {
      orgId: testOrg.id,
      userId: testUser.id,
      role: 'owner',
    },
  });
  console.log('Added user as org owner');

  // Create a second test org
  const secondOrg = await prisma.org.create({
    data: {
      name: 'demo-org',
      ownerId: testUser.id,
    },
  });
  console.log('Created second org:', secondOrg.name);

  await prisma.orgMember.create({
    data: {
      orgId: secondOrg.id,
      userId: testUser.id,
      role: 'owner',
    },
  });

  // Create test agent
  const testAgent = await prisma.agent.create({
    data: {
      name: 'test-agent',
      orgId: testOrg.id,
      description: 'A test agent for development',
      latestVersion: '0.1.0',
    },
  });
  console.log('Created test agent:', testAgent.name);

  // Create agent version
  const testContent = `---
name: Test Agent
version: 0.1.0
description: A test agent for development
---

# Test Agent

This is a test agent created during database seeding.

## Instructions
- This is a sample instruction
- Use this for testing
`;

  await prisma.agentVersion.create({
    data: {
      agentId: testAgent.id,
      version: '0.1.0',
      content: testContent,
      checksum: 'test-checksum-seed',
      gcsPath: 'testuser/test-agent/0.1.0/agent.agent.md',
    },
  });
  console.log('Created test agent version: 0.1.0');

  console.log('Database seed completed successfully!');
  console.log('\nTest credentials:');
  console.log('  Email: test@agentpkg.dev');
  console.log('  Password: testpassword123');
  console.log('  Username: testuser');
  console.log('  Org: testuser, demo-org');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
