import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class CreateReservationInput {
  @Field(() => ID)
  restaurantId: string;

  @Field()
  guestName: string;

  @Field(() => Date)
  date: Date;
}
