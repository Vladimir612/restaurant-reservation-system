import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { ReservationType } from './graphql-types/reservation.type';
import { ReservationService } from '../reservations/reservation.service';
import { RestaurantService } from '../restaurants/restaurant.service';
import { CreateReservationInput } from './graphql-types/create-reservation.input';

@Resolver(() => ReservationType)
export class ReservationResolver {
  constructor(
    private readonly reservationService: ReservationService,
    private readonly restaurantService: RestaurantService,
  ) {}

  @Mutation(() => ReservationType)
  async createReservation(@Args('data') data: CreateReservationInput) {
    await this.restaurantService.throwIfNotExists(data.restaurantId);

    return this.reservationService.createReservation(
      data.restaurantId,
      data.date,
      data.guestName,
    );
  }
}
