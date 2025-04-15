import { ArgsType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@ArgsType()
export class PostByIdArgs {
  @IsNotEmpty()
  @IsString()
  @Field()
  id: string;
}
