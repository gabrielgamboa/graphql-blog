import { Test, TestingModule } from '@nestjs/testing';
import { PrismaPostsRepository } from './prisma-posts.repository';
import { PrismaService } from '@/database/prisma/prisma.service';
import { execSync } from 'child_process';
import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error';
import { PostDataBuilder } from '@/posts/helpers/post-data-builder';
import { AuthorDataBuilder } from '@/authors/helpers/author-data-builder';

describe('PrismaPostsRepository Integration Tests', () => {
  let module: TestingModule;
  let prisma: PrismaService;
  let repository: PrismaPostsRepository;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();

    prisma = module.get(PrismaService);

    await prisma.$connect();
    execSync('npm run prisma:migratetest');

    repository = new PrismaPostsRepository(prisma);
  });

  afterAll(async () => {
    await module.close();
  });

  describe('find by id', () => {
    it('shoud throws an error when id is not found', async () => {
      await expect(() => repository.findById('any-id')).rejects.toBeInstanceOf(
        ResourceNotFoundError,
      );
    });

    it('shoud find a post', async () => {
      const author = AuthorDataBuilder();
      const authorCreated = await prisma.author.create({ data: author });

      const post = PostDataBuilder();
      const postCreated = await prisma.post.create({
        data: { ...post, authorId: authorCreated.id },
      });

      const response = await repository.findById(postCreated.id);

      expect(response).toBeDefined();
      expect(postCreated).toMatchObject(response);
    });

    //fazer demais testes de integração
  });
});
