import { Inject } from '@nestjs/common';
import { AuthorOutput } from '../dtos/author-output';
import { AuthorsRepository } from '../repositories/authors.repository';
import { Author } from '@/authors/infra/graphql/models/author';
import { BadRequestError } from '@/shared/errors/bad-request-error';
import { ResourceAlreadyExistsError } from '@/shared/errors/resource-already-exists-error';

export namespace UpdateAuthorUseCase {
  export type Input = Partial<Author>;

  export type Output = AuthorOutput;

  export class UseCase {
    constructor(
      @Inject('AuthorsRepository')
      private readonly authorsRepository: AuthorsRepository,
    ) {}

    async execute(data: Input): Promise<Output> {
      const { id, email, name } = data;

      if (!id) throw new BadRequestError('Id not provided');

      const author = await this.authorsRepository.findById(id);

      if (email) {
        const emailAlreadyExists =
          await this.authorsRepository.findByEmail(email);

        if (emailAlreadyExists && author.id !== emailAlreadyExists.id)
          throw new ResourceAlreadyExistsError(
            'Email already used by other author',
          );
      }

      const dataToSave: Partial<Author> = {
        ...(email && { email }),
        ...(name && { name }),
      };

      return this.authorsRepository.update(id, dataToSave);
    }
  }
}
