import { Module } from '@nestjs/common';
import { AuthorsResolver } from './infra/graphql/resolvers/authors.resolver';
import { DatabaseModule } from '@/database/database.module';
import { PrismaAuthorsRepository } from './infra/prisma/prisma-authors.repository';
import { ListAuthorsUsecase } from './domain/usecases/list-authors-usecase';
import { GetAuthorUseCase } from './domain/usecases/get-author-usecase';
import { UpdateAuthorUseCase } from './domain/usecases/update-author-usecase';
import { DeleteAuthorUseCase } from './domain/usecases/delete-author-usecase';
import { ProviderTokens } from '@/shared/tokens';
import { CreateAuthorUseCase } from './domain/usecases/create-author-usecase';

@Module({
  imports: [DatabaseModule],
  providers: [
    AuthorsResolver,
    ListAuthorsUsecase.Usecase,
    GetAuthorUseCase.UseCase,
    UpdateAuthorUseCase.UseCase,
    DeleteAuthorUseCase.UseCase,
    CreateAuthorUseCase.UseCase,
    {
      provide: ProviderTokens.AuthorsRepository,
      useClass: PrismaAuthorsRepository,
    },
  ],
  exports: [ProviderTokens.AuthorsRepository],
})
export class AuthorsModule {}
