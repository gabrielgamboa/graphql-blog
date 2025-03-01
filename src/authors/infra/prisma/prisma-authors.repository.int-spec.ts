import { Test, TestingModule } from '@nestjs/testing';
import { execSync } from 'node:child_process';
import { PrismaAuthorsRepository } from './prisma-authors.repository';
import { PrismaService } from '@/database/prisma/prisma.service';

describe('PrismaAuthorsRepository Integration Tests', () => {
  let module: TestingModule;
  let repository: PrismaAuthorsRepository;
  const prisma = new PrismaService();

  beforeAll(async () => {
    execSync('npm run prisma:migratetest');
    await prisma.$connect();
    module = await Test.createTestingModule({}).compile();
    repository = new PrismaAuthorsRepository(prisma);
  });

  beforeEach(async () => {
    await prisma.author.deleteMany();
  });

  afterAll(async () => {
    await module.close();
  });

  it('should throws an error when id is not found', async () => {
    // await expect(())
  });
});
