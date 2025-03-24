import { Test, TestingModule } from '@nestjs/testing';
import { execSync } from 'node:child_process';
import { PrismaService } from '@/database/prisma/prisma.service';
import { PrismaAuthorsRepository } from '@/authors/infra/prisma/prisma-authors.repository';
import { GetAuthorUseCase } from './get-author-usecase';
import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error';
import { UpdateAuthorUseCase } from './update-author-usecase';
import { BadRequestError } from '@/shared/errors/bad-request-error';
import { AuthorDataBuilder } from '@/authors/helper/author-data-builder';
import { ResourceAlreadyExistsError } from '@/shared/errors/resource-already-exists-error';

describe('GetAuthorUseCase Integration Tests', () => {
  let module: TestingModule;
  let repository: PrismaAuthorsRepository;
  let sut: UpdateAuthorUseCase.UseCase;
  const prisma = new PrismaService();

  beforeAll(async () => {
    execSync('npm run prisma:migratetest');
    await prisma.$connect();
    repository = new PrismaAuthorsRepository(prisma);
    sut = new UpdateAuthorUseCase.UseCase(repository);
    module = await Test.createTestingModule({}).compile();
  });

  beforeEach(async () => {
    await prisma.author.deleteMany();
  });

  afterAll(async () => {
    await module.close();
  });

  it('should throws if author id was no provided', async () => {
    const input = {};

    await expect(() => sut.execute(input)).rejects.toBeInstanceOf(
      BadRequestError,
    );
  });

  it('should throws if author was trying to change email with already existing email in database', async () => {
    const firstAuthor = await prisma.author.create({
      data: AuthorDataBuilder(),
    });
    const secondAuthor = await prisma.author.create({
      data: AuthorDataBuilder(),
    });

    secondAuthor.email = firstAuthor.email;

    await expect(() => sut.execute(secondAuthor)).rejects.toBeInstanceOf(
      ResourceAlreadyExistsError,
    );
  });

  it('should update an user', async () => {
    const data = AuthorDataBuilder();
    const author = await prisma.author.create({ data });
    author.email = 'gabriel@gmail.com';
    author.name = 'Gabriel Gambôa';
    const response = await sut.execute(author);
    expect(response.email).toBe(author.email);
    expect(response).toMatchObject(author);
  });
});
