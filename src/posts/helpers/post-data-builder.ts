import { faker } from '@faker-js/faker/.';
import { Post } from '../infra/graphql/models/post';
import { randomUUID } from 'node:crypto';

export function PostDataBuilder(props: Partial<Post> = {}): Omit<Post, 'id'> {
  return {
    title: props.title ?? faker.lorem.sentence(),
    content: props.content ?? faker.lorem.paragraph(),
    slug: props.slug ?? faker.lorem.slug(),
    authorId: props.authorId ?? randomUUID(),
    createdAt: props.createdAt ?? new Date(),
    publishedAt: props.publishedAt ?? new Date(),
  };
}
