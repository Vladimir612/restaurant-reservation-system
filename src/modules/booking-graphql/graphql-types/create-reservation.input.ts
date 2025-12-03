import { Field, ID, InputType } from '@nestjs/graphql';
import { IsDate, IsString } from 'class-validator';

@InputType()
export class CreateReservationInput {
  @Field(() => ID)
  @IsString()
  restaurantId: string;

  @Field()
  @IsString()
  guestName: string;

  @Field(() => Date, { description: 'UTC datetime string ending with Z' })
  @IsDate()
  date: string;
}
