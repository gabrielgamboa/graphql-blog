import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Author, SearchAuthorsResult } from '../models';
import { ListAuthorsUsecase } from '@/authors/domain/usecases/list-authors-usecase';
import { CreateAuthorUseCase } from '@/authors/domain/usecases/create-author-usecase';
import { CreateAuthorInput, SearchParamsArgs } from '../types';

@Resolver(() => Author)
export class AuthorsResolver {
  constructor(
    private readonly listAuthorsUseCase: ListAuthorsUsecase.Usecase,
    private readonly createAuthorUseCase: CreateAuthorUseCase.UseCase,
  ) {}

  @Query(() => SearchAuthorsResult)
  async authors(
    @Args() args: SearchParamsArgs,
  ): Promise<ListAuthorsUsecase.Output> {
    return this.listAuthorsUseCase.execute(args);
  }

  @Mutation(() => Author)
  async createAuthor(
    @Args('data') data: CreateAuthorInput,
  ): Promise<CreateAuthorUseCase.Output> {
    return this.createAuthorUseCase.execute(data);
  }
}
