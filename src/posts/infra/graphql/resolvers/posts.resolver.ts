import {
  Args,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Post } from '../models/post';
import { CreatePostUseCase } from '@/posts/domain/usecases/create-post.usecase';
import { CreatePostInput } from '../types/inputs/create-post.input';
import { PostOutput } from '@/posts/domain/dtos/post-output';
import { AuthorOutput } from '@/authors/domain/dtos/author-output';
import { GetAuthorUseCase } from '@/authors/domain/usecases/get-author-usecase';

@Resolver(() => Post)
export class PostsResolver {
  constructor(
    private readonly createPostUsecase: CreatePostUseCase.UseCase,
    private readonly getAuthorUsecase: GetAuthorUseCase.UseCase,
  ) {}

  @Mutation(() => Post)
  async createPost(@Args('data') data: CreatePostInput): Promise<PostOutput> {
    return this.createPostUsecase.execute(data);
  }

  //Permite data fetching sob demanda
  @ResolveField()
  async author(@Parent() post: Post): Promise<AuthorOutput> {
    return this.getAuthorUsecase.execute({ id: post.authorId });
  }
}
