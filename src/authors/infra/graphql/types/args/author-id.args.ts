import { Field, ArgsType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@ArgsType()
export class AuthorIdArgs {
  @IsString()
  @IsNotEmpty()
  @Field()
  id: string;
}
