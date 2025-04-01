import { Post } from '@/posts/infra/graphql/models/post';
import { CreatePost } from '../dtos/create-post';

export interface PostsRepository {
  create(data: CreatePost): Promise<Post>;
  update(id: string, data: Partial<Post>): Promise<Post>;
  findById(id: string): Promise<Post>;
  findBySlug(slug: string): Promise<Post>;
}
