import { PaginationResult } from '@/shared/dtos/pagination-result';
import { SearchParamsInput } from '@/shared/dtos/search-params';
import { Author } from '@prisma/client';
import { AuthorOutput } from '../dtos/author-output';
import { AuthorsRepository } from '../repositories/authors.repository';
import { Inject } from '@nestjs/common';

export namespace ListAuthorsUsecase {
  export type Input = SearchParamsInput<Author, 'name' | 'email' | 'createdAt'>;

  export type Output = PaginationResult<AuthorOutput>;

  export class Usecase {
    constructor(
      @Inject('AuthorsRepository') private authorsRepository: AuthorsRepository,
    ) {}

    async execute(input: Input): Promise<Output> {
      const authors = await this.authorsRepository.search(input);
      return authors;
    }
  }
}
