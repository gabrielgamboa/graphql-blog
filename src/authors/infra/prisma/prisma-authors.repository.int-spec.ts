import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';
import { PrismaAuthorsRepository } from './prisma-authors.repository';
import { PrismaService } from '@/database/prisma/prisma.service';

describe('PrismaAuthorsRepository Integration Tests', () => {
  let module: TestingModule;
  let repository: PrismaAuthorsRepository;
  const prisma = new PrismaService();

  beforeAll(async () => {
    execSync('npm run prisma:migratetest');
    module = await Test.createTestingModule({}).compile();
    repository = new PrismaAuthorsRepository(prisma);
  });

  beforeEach(async () => {
    await prisma.author.deleteMany();
  });

  afterAll(async () => {
    await module.close();
  });
});
