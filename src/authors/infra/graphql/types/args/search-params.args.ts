import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsOptional, IsString, Min } from 'class-validator';

@ArgsType()
export class SearchParamsArgs {
  @IsOptional()
  @Min(1)
  @Field(() => Int, { nullable: true })
  page?: number;

  @IsOptional()
  @Field(() => Int, { nullable: true })
  perPage?: number;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  sortBy?: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  sort?: 'asc' | 'desc';

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  filter?: string;
}
