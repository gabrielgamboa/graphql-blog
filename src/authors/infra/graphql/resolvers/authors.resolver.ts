import { Args, Query, Resolver } from '@nestjs/graphql';
import { Author, SearchAuthorsResult } from '../models';
import { ListAuthorsUsecase } from '@/authors/domain/usecases/list-authors-usecase';
import { SearchParamsArgs } from '../args/search-params.args';

@Resolver(() => Author)
export class AuthorsResolver {
  constructor(
    private readonly listAuthorsUseCase: ListAuthorsUsecase.Usecase,
  ) {}

  @Query(() => SearchAuthorsResult)
  authors(@Args() args: SearchParamsArgs) {
    return this.listAuthorsUseCase.execute(args);
  }
}
