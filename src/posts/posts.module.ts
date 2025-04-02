import { ProviderTokens } from '@/shared/tokens';
import { DatabaseModule } from '@faker-js/faker/.';
import { Module } from '@nestjs/common';
import { PrismaPostsRepository } from './infra/prisma/prisma-posts.repository';

@Module({
  imports: [DatabaseModule],
  providers: [
    {
      provide: ProviderTokens.PostsRepository,
      useClass: PrismaPostsRepository,
    },
  ],
  exports: [ProviderTokens.PostsRepository],
})
export class PostsModule {}
