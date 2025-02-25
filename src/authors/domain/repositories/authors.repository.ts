import { Author } from '../../infra/graphql/models/author';
import { CreateAuthor } from './dtos/create-author';

export type SearchParams<T, K extends keyof T> = {
  page?: number;
  perPage?: number;
  filter?: string;
  sortBy?: K;
  sort?: 'asc' | 'desc';
};

export type SearchResult<T> = {
  items: T[];
  currentPage: number;
  perPage: number;
  lastPage: number;
  total: number;
};

export interface AuthorsRepository {
  create(data: CreateAuthor): Promise<Author>;
  findById(id: string): Promise<Author>;
  findByEmail(email: string): Promise<Author>;
  update(data: Author): Promise<Author>;
  delete(id: string): Promise<void>;
  search(
    data: SearchParams<Author, 'name' | 'email' | 'createdAt'>,
  ): Promise<SearchResult<Author>>;
  get(id: string): Promise<Author>;
}
