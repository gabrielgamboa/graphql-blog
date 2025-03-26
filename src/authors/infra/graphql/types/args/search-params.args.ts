import { ArgsType, Field, Int } from '@nestjs/graphql';

@ArgsType()
export class SearchParamsArgs {
  @Field(() => Int, { nullable: true })
  page?: number;

  @Field(() => Int, { nullable: true })
  perPage?: number;

  @Field({ nullable: true })
  sortBy?: string;

  @Field({ nullable: true })
  sort?: 'asc' | 'desc';

  @Field({ nullable: true })
  filter?: string;
}
