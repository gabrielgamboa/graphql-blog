import { Module } from '@nestjs/common';
import { AuthorsResolver } from './graphql/resolvers/authors.resolver';

@Module({
  providers: [AuthorsResolver],
})
export class AuthorsModule {}
