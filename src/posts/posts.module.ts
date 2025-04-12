import { ProviderTokens } from '@/shared/tokens';
import { Module } from '@nestjs/common';
import { PrismaPostsRepository } from './infra/prisma/prisma-posts.repository';
import { PostsResolver } from './infra/graphql/resolvers/posts.resolver';
import { CreatePostUseCase } from './domain/usecases/create-post.usecase';
import { GetPostUseCase } from './domain/usecases/get-post.usecase';
import { PublishPostUseCase } from './domain/usecases/publish-post.usecase';
import { UnpublishPostUseCase } from './domain/usecases/unpublish-post.usecase';
import { DatabaseModule } from '@/database/database.module';
import { AuthorsModule } from '@/authors/authors.module';

@Module({
  imports: [DatabaseModule, AuthorsModule],
  providers: [
    PostsResolver,
    CreatePostUseCase.UseCase,
    GetPostUseCase.UseCase,
    PublishPostUseCase.UseCase,
    UnpublishPostUseCase.UseCase,
    {
      provide: ProviderTokens.PostsRepository,
      useClass: PrismaPostsRepository,
    },
  ],
  exports: [ProviderTokens.PostsRepository],
})
export class PostsModule {}
