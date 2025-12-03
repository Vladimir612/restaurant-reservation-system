import { Args, ID, Query, Resolver } from '@nestjs/graphql';
import { RestaurantType } from './graphql-types/restaurant.type';
import { RestaurantService } from '../restaurants/restaurant.service';
import { ReservationService } from '../reservations/reservation.service';

@Resolver(() => RestaurantType)
export class RestaurantResolver {
  constructor(
    private readonly restaurantService: RestaurantService,
    private readonly reservationService: ReservationService,
  ) {}

  @Query(() => RestaurantType, { nullable: true })
  async getRestaurant(@Args('id', { type: () => ID }) id: string) {
    const restaurant = await this.restaurantService.findById(id);

    if (!restaurant) return null;

    const reservations = await this.reservationService.findByRestaurant(id);

    return {
      ...restaurant.toObject(),
      reservations: reservations.map((r) => r.toObject()),
    };
  }
}
