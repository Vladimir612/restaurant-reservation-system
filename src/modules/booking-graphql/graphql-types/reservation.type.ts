import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ReservationType {
  @Field(() => ID)
  id: string;

  @Field()
  restaurantId: string;

  @Field()
  guestName: string;

  @Field()
  date: Date;
}
