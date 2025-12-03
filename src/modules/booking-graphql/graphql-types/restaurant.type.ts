import { Field, ID, ObjectType } from '@nestjs/graphql';
import { ReservationType } from 'src/modules/booking-graphql/graphql-types/reservation.type';

@ObjectType()
export class RestaurantType {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  openHour: string;

  @Field()
  closeHour: string;

  @Field(() => [ReservationType], { nullable: true })
  reservations?: ReservationType[];
}
