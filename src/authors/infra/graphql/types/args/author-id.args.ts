import { Field, ArgsType } from '@nestjs/graphql';

@ArgsType()
export class AuthorIdArgs {
  @Field()
  id: string;
}
