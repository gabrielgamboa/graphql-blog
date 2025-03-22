import { Test, TestingModule } from '@nestjs/testing';
import { execSync } from 'node:child_process';
import { PrismaService } from '@/database/prisma/prisma.service';
import { CreateAuthorUseCase } from './create-author-usecase';
import { PrismaAuthorsRepository } from '@/authors/infra/prisma/prisma-authors.repository';
import { AuthorDataBuilder } from '@/authors/helper/author-data-builder';
import { BadRequestError } from '@/shared/errors/bad-request-error';
import { ResourceAlreadyExistsError } from '@/shared/errors/resource-already-exists-error';

describe('CreateAuthorUseCase Integration Tests', () => {
  let module: TestingModule;
  let repository: PrismaAuthorsRepository;
  let sut: CreateAuthorUseCase.UseCase;
  const prisma = new PrismaService();

  beforeAll(async () => {
    execSync('npm run prisma:migratetest');
    await prisma.$connect();
    repository = new PrismaAuthorsRepository(prisma);
    sut = new CreateAuthorUseCase.UseCase(repository);
    module = await Test.createTestingModule({}).compile();
  });

  beforeEach(async () => {
    await prisma.author.deleteMany();
  });

  afterAll(async () => {
    await module.close();
  });

  it('should create author with correct values', async () => {
    const author = AuthorDataBuilder();
    const createdAuthor = await sut.execute(author);
    expect(createdAuthor.id).toBeDefined();
    expect(createdAuthor).toHaveProperty('createdAt');
  });

  it('should throw error if email already exists', async () => {
    const email = 'gabriel@gmail.com';
    const author = AuthorDataBuilder({ email });
    await prisma.author.create({ data: author });
    await expect(sut.execute(author)).rejects.toBeInstanceOf(
      ResourceAlreadyExistsError,
    );
  });

  it('should throw error if name or email was no provided', async () => {
    const author = AuthorDataBuilder();
    await expect(
      sut.execute({ name: author.name, email: null as unknown as string }),
    ).rejects.toBeInstanceOf(BadRequestError);

    await expect(
      sut.execute({ name: null as unknown as string, email: author.email }),
    ).rejects.toBeInstanceOf(BadRequestError);
  });
});
