import { Author } from '@/authors/infra/graphql/models/author';
import {
  AuthorsRepository,
  SearchParams,
  SearchResult,
} from '../../domain/repositories/authors.repository';
import { CreateAuthor } from '../../domain/repositories/dtos/create-author';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/database/prisma/prisma.service';

@Injectable()
export class PrismaAuthorsRepository implements AuthorsRepository {
  constructor(private prismaService: PrismaService) {}

  create(data: CreateAuthor): Promise<Author> {
    throw new Error('Method not implemented.');
  }
  findById(id: string): Promise<Author> {
    throw new Error('Method not implemented.');
  }
  findByEmail(email: string): Promise<Author> {
    throw new Error('Method not implemented.');
  }
  update(data: Author): Promise<Author> {
    throw new Error('Method not implemented.');
  }
  delete(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
  search(
    data: SearchParams<Author, 'name' | 'email' | 'createdAt'>,
  ): Promise<SearchResult<Author>> {
    throw new Error('Method not implemented.');
  }
  get(id: string): Promise<Author> {
    throw new Error('Method not implemented.');
  }
}
