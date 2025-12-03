import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
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

  @Field()
  timezone: string;

  @Field(() => [ReservationType], { nullable: true })
  reservations?: ReservationType[];

  @Field(() => Int, {
    description: 'Total number of reservations for this restaurant',
  })
  reservationCount: number;
}
