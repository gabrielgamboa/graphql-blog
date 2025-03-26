import { Inject, Injectable } from '@nestjs/common';
import { AuthorsRepository } from '../repositories/authors.repository';
import { BadRequestError } from '@/shared/errors/bad-request-error';
import { ResourceAlreadyExistsError } from '@/shared/errors/resource-already-exists-error';
import { AuthorOutput } from '../dtos/author-output';

export namespace CreateAuthorUseCase {
  export type Input = {
    name: string;
    email: string;
  };

  export type Output = AuthorOutput;

  @Injectable()
  export class UseCase {
    constructor(
      @Inject('AuthorsRepository')
      private readonly authorsRepository: AuthorsRepository,
    ) {}

    async execute(data: Input): Promise<Output> {
      const { email, name } = data;
      if (!email || !name) throw new BadRequestError('Input data not provided');
      const emailExists = await this.authorsRepository.findByEmail(email);
      if (emailExists)
        throw new ResourceAlreadyExistsError('Email used by other author');
      const author = await this.authorsRepository.create({ email, name });
      return author;
    }
  }
}
