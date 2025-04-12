import slugify from 'slugify';

import { BadRequestError } from '@/shared/errors/bad-request-error';
import { ResourceAlreadyExistsError } from '@/shared/errors/resource-already-exists-error';
import { Injectable, Inject } from '@nestjs/common';
import { PostOutput } from '../dtos/post-output';
import { PostsRepository } from '../repositories/posts.repository';
import { AuthorsRepository } from '@/authors/domain/repositories/authors.repository';

export namespace CreatePostUseCase {
  export type Input = {
    title: string;
    content: string;
    authorId: string;
  };

  export type Output = PostOutput;

  @Injectable()
  export class UseCase {
    constructor(
      @Inject('PostsRepository')
      private readonly postsRepository: PostsRepository,
      @Inject('AuthorsRepository')
      private readonly authorsRepository: AuthorsRepository,
    ) {}

    async execute(data: Input): Promise<Output> {
      const { authorId, content, title } = data;
      if (!content || !title) {
        throw new BadRequestError('Title or content not provided');
      }
      await this.authorsRepository.findById(authorId);
      const slug = slugify(title, { lower: true });
      const postAlreadyExists = await this.postsRepository.findBySlug(slug);
      if (postAlreadyExists) {
        throw new ResourceAlreadyExistsError('Slug already exists');
      }
      const post = await this.postsRepository.create({
        title,
        content,
        slug,
        authorId,
      });
      return post;
    }
  }
}
