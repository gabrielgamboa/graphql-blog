import { Post } from '@/posts/infra/graphql/models/post';

export interface PostsRepository {
  create(data: Omit<Post, 'id' | 'createdAt'>): Promise<Post>;
  update(id: string, data: Omit<Partial<Post>, 'author'>): Promise<Post>;
  findById(id: string): Promise<Post>;
  findBySlug(slug: string): Promise<Post | null>;
  get(id: string): Promise<Post>;
}
