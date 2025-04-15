import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Post } from '../models/post';
import { CreatePostUseCase } from '@/posts/domain/usecases/create-post.usecase';
import { CreatePostInput } from '../types/inputs/create-post.input';
import { PostOutput } from '@/posts/domain/dtos/post-output';
import { AuthorOutput } from '@/authors/domain/dtos/author-output';
import { GetAuthorUseCase } from '@/authors/domain/usecases/get-author-usecase';
import { GetPostUseCase } from '@/posts/domain/usecases/get-post.usecase';
import { PostByIdArgs } from '../types/args/post-by-id.args';
import { PublishPostUseCase } from '@/posts/domain/usecases/publish-post.usecase';
import { UnpublishPostUseCase } from '@/posts/domain/usecases/unpublish-post.usecase';

@Resolver(() => Post)
export class PostsResolver {
  constructor(
    private readonly createPostUsecase: CreatePostUseCase.UseCase,
    private readonly getPostUseCase: GetPostUseCase.UseCase,
    private readonly getAuthorUseCase: GetAuthorUseCase.UseCase,
    private readonly publishPostUseCase: PublishPostUseCase.UseCase,
    private readonly unpublishPostUseCase: UnpublishPostUseCase.UseCase,
  ) {}

  @Mutation(() => Post)
  async createPost(@Args('data') data: CreatePostInput): Promise<PostOutput> {
    return this.createPostUsecase.execute(data);
  }

  @Query(() => Post)
  async getPostById(@Args() { id }: PostByIdArgs): Promise<PostOutput> {
    return this.getPostUseCase.execute({ id });
  }

  @Mutation(() => Post)
  async publishPost(@Args() { id }: PostByIdArgs): Promise<PostOutput> {
    return this.publishPostUseCase.execute({ id });
  }

  @Mutation(() => Post)
  async unpublishPost(@Args() { id }: PostByIdArgs): Promise<PostOutput> {
    return this.unpublishPostUseCase.execute({ id });
  }

  //Permite data fetching sob demanda
  @ResolveField()
  async author(@Parent() post: Post): Promise<AuthorOutput> {
    return this.getAuthorUseCase.execute({ id: post.authorId });
  }
}
