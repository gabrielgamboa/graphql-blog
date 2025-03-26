import { SearchParamsInput } from '@/shared/dtos/search-params';
import { Author } from '../../infra/graphql/models/author';
import { CreateAuthor } from './dtos/create-author';
import { PaginationResult } from '@/shared/dtos/pagination-result';

export interface AuthorsRepository {
  create(data: CreateAuthor): Promise<Author>;
  findById(id: string): Promise<Author>;
  findByEmail(email: string): Promise<Author | null>;
  update(id: string, data: Partial<Author>): Promise<Author>;
  delete(id: string): Promise<Author>;
  search(data: SearchParamsInput): Promise<PaginationResult<Author>>;
  get(id: string): Promise<Author>;
}
