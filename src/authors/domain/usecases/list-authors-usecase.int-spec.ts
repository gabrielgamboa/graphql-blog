import { Test, TestingModule } from '@nestjs/testing';
import { execSync } from 'node:child_process';
import { PrismaService } from '@/database/prisma/prisma.service';
import { PrismaAuthorsRepository } from '@/authors/infra/prisma/prisma-authors.repository';
import { AuthorDataBuilder } from '@/authors/helpers/author-data-builder';
import { ListAuthorsUsecase } from './list-authors-usecase';
import { Prisma } from '@prisma/client';

describe('ListAuthorsUseCase Integration Tests', () => {
  let module: TestingModule;
  let repository: PrismaAuthorsRepository;
  let sut: ListAuthorsUsecase.Usecase;
  const prisma = new PrismaService();

  beforeAll(async () => {
    execSync('npm run prisma:migratetest');
    await prisma.$connect();
    repository = new PrismaAuthorsRepository(prisma);
    sut = new ListAuthorsUsecase.Usecase(repository);
    module = await Test.createTestingModule({}).compile();
  });

  beforeEach(async () => {
    await prisma.author.deleteMany();
  });

  afterAll(async () => {
    await module.close();
  });

  it('should list authors by default with no search params', async () => {
    const createdAt = new Date();
    const data: Prisma.AuthorCreateInput[] = [];
    const arrange = Array(3).fill(AuthorDataBuilder());
    arrange.forEach((author, index) => {
      const currentTimestamp = createdAt.getTime() + index;

      data.push({
        ...author,
        email: `email${index}@gmail.com`,
        createdAt: new Date(currentTimestamp),
      } as Prisma.AuthorCreateInput);
    });

    await prisma.author.createMany({ data });

    const response = await sut.execute({});

    expect(response.items.length).toBe(3);
    expect(response.total).toBe(3);
    expect(response).toMatchObject({
      items: data.reverse(),
      total: 3,
      perPage: 15,
      currentPage: 1,
      lastPage: 1,
    });
  });

  test('should apply pagination, filter and ordering', async () => {
    const createdAt = new Date();
    const data: Prisma.AuthorCreateInput[] = [];
    const arrange = ['test', 'a', 'TEST', 'b', 'Test'];
    arrange.forEach((element, index) => {
      const timestamp = createdAt.getTime() + index;
      data.push({
        ...AuthorDataBuilder({ name: element }),
        email: `email${index}@gmail.com`,
        createdAt: new Date(timestamp),
      } as Prisma.AuthorCreateInput);
    });
    await prisma.author.createMany({ data });
    const result1 = await sut.execute({
      page: 1,
      perPage: 2,
      sortBy: 'name',
      sort: 'asc',
      filter: 'TEST',
    });

    expect(result1).toMatchObject({
      items: [data[0], data[4]],
      total: 3,
      currentPage: 1,
      perPage: 2,
      lastPage: 2,
    });

    const result2 = await sut.execute({
      page: 2,
      perPage: 2,
      sortBy: 'name',
      sort: 'asc',
      filter: 'TEST',
    });

    expect(result2).toMatchObject({
      items: [data[2]],
      total: 3,
      currentPage: 2,
      perPage: 2,
      lastPage: 2,
    });
  });
});
