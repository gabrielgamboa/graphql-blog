import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Post {
  @Field()
  id: string;

  @Field()
  title: string;

  @Field()
  slug: string;

  @Field()
  content: string;

  @Field()
  authorId: string;

  @Field()
  createdAt: Date;

  @Field()
  publishedAt?: Date;
}
