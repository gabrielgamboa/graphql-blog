import { Author } from '@/authors/infra/graphql/models/author';
import {
  AuthorsRepository,
  SearchParams,
  SearchResult,
} from '../../domain/repositories/authors.repository';
import { CreateAuthor } from '../../domain/repositories/dtos/create-author';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/database/prisma/prisma.service';
import { ResourceNotFoundError } from '@/shared/errors/resource-not-found';

@Injectable()
export class PrismaAuthorsRepository implements AuthorsRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateAuthor): Promise<Author> {
    throw new Error('Method not implemented.');
  }

  async findById(id: string): Promise<Author> {
    return this.get(id);
  }

  async findByEmail(email: string): Promise<Author> {
    throw new Error('Method not implemented.');
  }

  async update(data: Author): Promise<Author> {
    throw new Error('Method not implemented.');
  }

  async delete(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async search(
    data: SearchParams<Author, 'name' | 'email' | 'createdAt'>,
  ): Promise<SearchResult<Author>> {
    throw new Error('Method not implemented.');
  }

  private async get(id: string): Promise<Author> {
    const author = await this.prisma.author.findUnique({
      where: { id },
    });

    if (!author) throw new ResourceNotFoundError();

    return author;
  }
}
