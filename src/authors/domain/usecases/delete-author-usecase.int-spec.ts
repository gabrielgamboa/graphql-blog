import { Test, TestingModule } from '@nestjs/testing';
import { execSync } from 'node:child_process';
import { PrismaService } from '@/database/prisma/prisma.service';
import { PrismaAuthorsRepository } from '@/authors/infra/prisma/prisma-authors.repository';
import { AuthorDataBuilder } from '@/authors/helpers/author-data-builder';
import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error';
import { DeleteAuthorUseCase } from './delete-author-usecase';

describe('DeleteAuthorUseCase Integration Tests', () => {
  let module: TestingModule;
  let repository: PrismaAuthorsRepository;
  let sut: DeleteAuthorUseCase.UseCase;
  const prisma = new PrismaService();

  beforeAll(async () => {
    execSync('npm run prisma:migratetest');
    await prisma.$connect();
    repository = new PrismaAuthorsRepository(prisma);
    sut = new DeleteAuthorUseCase.UseCase(repository);
    module = await Test.createTestingModule({}).compile();
  });

  beforeEach(async () => {
    await prisma.author.deleteMany();
  });

  afterAll(async () => {
    await module.close();
  });

  it('should delete an author correctly', async () => {
    const data = AuthorDataBuilder();
    const authorCreated = await prisma.author.create({ data });
    const response = await sut.execute({ id: authorCreated.id });
    expect(response.id).toBeDefined();
    expect(response).toStrictEqual(authorCreated);

    const authors = await prisma.author.findMany();

    expect(authors).toHaveLength(0);
  });

  it('should throws if author id does not exists', async () => {
    await expect(sut.execute({ id: 'random-uuid' })).rejects.toBeInstanceOf(
      ResourceNotFoundError,
    );
  });
});
