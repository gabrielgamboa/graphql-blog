import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Author, SearchAuthorsResult } from '../models';
import { ListAuthorsUsecase } from '@/authors/domain/usecases/list-authors-usecase';
import { CreateAuthorUseCase } from '@/authors/domain/usecases/create-author-usecase';
import { CreateAuthorInput, SearchParamsArgs } from '../types';
import { GetAuthorUseCase } from '@/authors/domain/usecases/get-author-usecase';
import { AuthorIdArgs } from '../types/args/author-id.args';

@Resolver(() => Author)
export class AuthorsResolver {
  constructor(
    private readonly listAuthorsUseCase: ListAuthorsUsecase.Usecase,
    private readonly createAuthorUseCase: CreateAuthorUseCase.UseCase,
    private readonly getAuthorUseCase: GetAuthorUseCase.UseCase,
  ) {}

  @Query(() => SearchAuthorsResult)
  async authors(
    @Args() args: SearchParamsArgs,
  ): Promise<ListAuthorsUsecase.Output> {
    return this.listAuthorsUseCase.execute(args);
  }

  @Query(() => Author)
  async getAuthorById(
    @Args() data: AuthorIdArgs,
  ): Promise<GetAuthorUseCase.Output> {
    return this.getAuthorUseCase.execute(data);
  }

  @Mutation(() => Author)
  async createAuthor(
    @Args('data') data: CreateAuthorInput,
  ): Promise<CreateAuthorUseCase.Output> {
    return this.createAuthorUseCase.execute(data);
  }
}
