import { Test, TestingModule } from '@nestjs/testing';
import { execSync } from 'node:child_process';
import { PrismaAuthorsRepository } from './prisma-authors.repository';
import { PrismaService } from '@/database/prisma/prisma.service';
import { AuthorDataBuilder } from '@/authors/helper/author-data-builder';
import { Prisma } from '@prisma/client';

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

  describe('find by id', () => {
    it('should throws an error when id is not found', async () => {
      await expect(repository.findById('random-uuid')).rejects.toThrow();
    });

    it('should get an user by id', async () => {
      const data = AuthorDataBuilder();

      const authorCreated = await prisma.author.create({
        data,
      });

      const response = await repository.findById(authorCreated.id);

      expect(response.id).toBeDefined();
      expect(response.id).toBe(authorCreated.id);
      expect(response).toStrictEqual(authorCreated);
    });

    it('should create an author', async () => {
      const data = AuthorDataBuilder();

      const authorCreated = await repository.create(data);

      expect(authorCreated.id).toBeDefined();
      expect(authorCreated).toMatchObject(data);
    });
  });

  describe('search', () => {
    it('should only apply pagination when no filters are passed', async () => {
      const createdAt = new Date();
      const data: Prisma.AuthorCreateInput[] = [];
      const arrange = Array(16).fill(AuthorDataBuilder());
      arrange.forEach((author, index) => {
        const currentTimestamp = createdAt.getTime() + index;

        data.push({
          ...author,
          email: `email${index}@gmail.com`,
          createdAt: new Date(currentTimestamp),
        } as Prisma.AuthorCreateInput);
      });

      await prisma.author.createMany({ data });

      const response = await repository.search();

      expect(response.total).toBe(16);
      expect(response.items.length).toBe(15);
      response.items.forEach((element) => {
        expect(element.id).toBeDefined();
      });

      response.items.reverse().forEach((author, index) => {
        expect(`email${index + 1}@gmail.com`).toBe(author.email);
      });
    });

    it('should only apply pagination and ordering', async () => {
      const createdAt = new Date();
      const data: Prisma.AuthorCreateInput[] = [];
      const arrange = 'bacd';
      arrange.split('').forEach((name, index) => {
        const currentTimestamp = createdAt.getTime() + index;

        data.push({
          name,
          email: `email${index}@gmail.com`,
          createdAt: new Date(currentTimestamp),
        } as Prisma.AuthorCreateInput);
      });

      await prisma.author.createMany({ data });

      const response = await repository.search({
        page: 1,
        perPage: 2,
        sortBy: 'name',
        sort: 'asc',
      });

      expect(response.total).toBe(4);
      expect(response.items.length).toBe(2);
      expect(response.items[0]).toMatchObject(data[1]);
      expect(response.items[1]).toMatchObject(data[0]);
    });

    it('should apply filter, pagination and ordering', async () => {
      const createdAt = new Date();
      const data: Prisma.AuthorCreateInput[] = [];
      const arrange = ['Test', 'test', 'a', 'b', 'TEST'];
      arrange.forEach((name, index) => {
        const currentTimestamp = createdAt.getTime() + index;

        data.push({
          name,
          email: `email${index}@gmail.com`,
          createdAt: new Date(currentTimestamp),
        } as Prisma.AuthorCreateInput);
      });

      await prisma.author.createMany({ data });

      const response = await repository.search({
        page: 1,
        perPage: 2,
        sortBy: 'name',
        sort: 'asc',
        filter: 'TEST',
      });

      expect(response.total).toBe(3);
      expect(response.items.length).toBe(2);
      expect(response.items[0]).toMatchObject(data[1]);
      expect(response.items[1]).toMatchObject(data[0]);

      const response2 = await repository.search({
        page: 2,
        perPage: 2,
        sortBy: 'name',
        sort: 'asc',
        filter: 'TEST',
      });

      expect(response2.total).toBe(3);
      expect(response2.items.length).toBe(1);
      expect(response2.items[0]).toMatchObject(data[4]);
    });
  });
});
