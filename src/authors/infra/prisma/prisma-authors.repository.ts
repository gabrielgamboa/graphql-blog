import { Author } from '@/authors/infra/graphql/models/author';
import { AuthorsRepository } from '../../domain/repositories/authors.repository';
import { CreateAuthor } from '../../domain/repositories/dtos/create-author';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/database/prisma/prisma.service';
import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error';
import { SearchParamsInput } from '@/shared/dtos/search-params';
import { PaginationResult } from '@/shared/dtos/pagination-result';

@Injectable()
export class PrismaAuthorsRepository implements AuthorsRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateAuthor): Promise<Author> {
    const author = await this.prisma.author.create({ data });
    return author;
  }

  findById(id: string): Promise<Author> {
    return this.get(id);
  }

  async findByEmail(email: string): Promise<Author | null> {
    const author = await this.prisma.author.findUnique({ where: { email } });
    return author;
  }

  async update(id: string, data: Partial<Author>): Promise<Author> {
    await this.get(id);
    const updatedAuthor = await this.prisma.author.update({
      where: { id },
      data, //SET
    });

    return updatedAuthor;
  }

  async delete(id: string): Promise<Author> {
    const author = await this.get(id);
    await this.prisma.author.delete({ where: { id } });
    return author;
  }

  async search(
    data: SearchParamsInput<Author, 'name' | 'email' | 'createdAt'> = {},
  ): Promise<PaginationResult<Author>> {
    const { page = 1, perPage = 15, filter, sort, sortBy } = data;

    const orderByField = sortBy ?? 'createdAt';
    const sortDirection = sort ?? 'desc';

    const authorsCount = await this.prisma.author.count({
      ...(filter && {
        where: {
          OR: [
            {
              name: { contains: filter, mode: 'insensitive' },
            },
            {
              email: { contains: filter, mode: 'insensitive' },
            },
          ],
        },
      }),
    });

    const authors = await this.prisma.author.findMany({
      ...(filter && {
        where: {
          OR: [
            {
              name: { contains: filter, mode: 'insensitive' },
            },
            {
              email: { contains: filter, mode: 'insensitive' },
            },
          ],
        },
      }),
      orderBy: { [orderByField]: sortDirection },
      skip: page > 0 ? (page - 1) * perPage : 1,
      take: perPage > 0 ? perPage : 15,
    });

    return {
      items: authors,
      total: authorsCount,
      currentPage: page,
      lastPage: Math.ceil(authorsCount / perPage),
      perPage,
    };
  }

  async get(id: string): Promise<Author> {
    const author = await this.prisma.author.findUnique({
      where: { id },
    });

    if (!author) throw new ResourceNotFoundError();

    return author;
  }
}
