import { Post } from '@/posts/infra/graphql/models/post';

export type CreatePost = Omit<Post, 'id'>;
