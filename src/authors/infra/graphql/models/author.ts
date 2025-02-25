import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType() //modelo de dados manipulados pela API
export class Author {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  createdAt: Date;
}

//@InputType() //parametros para criar um author
