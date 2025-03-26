import { Inject, Injectable } from '@nestjs/common';
import { AuthorOutput } from '../dtos/author-output';
import { AuthorsRepository } from '../repositories/authors.repository';

export namespace GetAuthorUseCase {
  export type Input = {
    id: string;
  };

  export type Output = AuthorOutput;

  @Injectable()
  export class UseCase {
    constructor(
      @Inject('AuthorsRepository')
      private readonly authorsRepository: AuthorsRepository,
    ) {}

    async execute(data: Input): Promise<Output> {
      const { id } = data;
      const author = await this.authorsRepository.findById(id);
      return author;
    }
  }
}
