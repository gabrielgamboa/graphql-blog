import { ResourceAlreadyExistsError } from '@/shared/errors/resource-already-exists-error';
import { Injectable, Inject } from '@nestjs/common';
import { PostOutput } from '../dtos/post-output';
import { PostsRepository } from '../repositories/posts.repository';

export namespace PublishPostUseCase {
  export type Input = {
    id: string;
  };

  export type Output = PostOutput;

  @Injectable()
  export class UseCase {
    constructor(
      @Inject('PostsRepository')
      private readonly postsRepository: PostsRepository,
    ) {}

    async execute({ id }: Input): Promise<Output> {
      const post = await this.postsRepository.findById(id);
      if (post.publishedAt) {
        throw new ResourceAlreadyExistsError('Post already published');
      }
      post.publishedAt = new Date();
      await this.postsRepository.update(id, post);
      return post;
    }
  }
}
