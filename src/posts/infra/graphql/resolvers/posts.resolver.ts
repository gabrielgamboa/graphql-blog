import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Post } from '../models/post';
import { CreatePostUseCase } from '@/posts/domain/usecases/create-post.usecase';
import { CreatePostInput } from '../types/inputs/create-post.input';
import { PostOutput } from '@/posts/domain/dtos/post-output';

@Resolver(() => Post)
export class PostsResolver {
  constructor(private readonly createPostUsecase: CreatePostUseCase.UseCase) {}

  @Mutation(() => Post)
  async createPost(@Args('data') data: CreatePostInput): Promise<PostOutput> {
    return this.createPostUsecase.execute(data);
  }
}
