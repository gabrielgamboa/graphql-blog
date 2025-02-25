import { PrismaService } from '@/database/prisma/prisma.service';
import { Query, Resolver } from '@nestjs/graphql';
import { Author } from '../models/author';

@Resolver(() => Author)
export class AuthorsResolver {
  constructor(private prismaService: PrismaService) {}

  @Query(() => [Author])
  authors() {
    return this.prismaService.author.findMany();
  }
}
