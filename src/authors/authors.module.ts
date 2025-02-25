import { Module } from '@nestjs/common';
import { AuthorsResolver } from './infra/graphql/resolvers/authors.resolver';
import { DatabaseModule } from '@/database/database.module';
import { PrismaAuthorsRepository } from './infra/prisma/prisma-authors.repository';

@Module({
  imports: [DatabaseModule],
  providers: [
    AuthorsResolver,
    {
      provide: 'AuthorsRepository',
      useClass: PrismaAuthorsRepository,
    },
  ],
  exports: ['AuthorsRepository'],
})
export class AuthorsModule {}
