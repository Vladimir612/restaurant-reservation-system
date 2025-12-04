import {
  Args,
  ID,
  Int,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { RestaurantType } from './graphql-types/restaurant.type';
import { RestaurantService } from '../restaurants/restaurant.service';
import { ReservationService } from '../reservations/reservation.service';
import { UseGuards } from '@nestjs/common';
import { GraphqlJwtAuthGuard } from '../auth/guards/graphql/graphql-jwt-auth.guard';
import { RestaurantScopeGuard } from '../auth/guards/graphql/restaurant-scope.guard';
import { ReservationType } from './graphql-types/reservation.type';

@Resolver(() => RestaurantType)
export class RestaurantResolver {
  constructor(
    private readonly restaurantService: RestaurantService,
    private readonly reservationService: ReservationService,
  ) {}

  @Query(() => RestaurantType, { nullable: true })
  @UseGuards(GraphqlJwtAuthGuard, RestaurantScopeGuard)
  async getRestaurant(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<RestaurantType | null> {
    const restaurant = await this.restaurantService.findById(id);

    if (!restaurant) return null;

    const reservations = await this.reservationService.findByRestaurant(id);

    const restaurantObj = restaurant.toObject<RestaurantType>();
    const reservationsObj = reservations.map((r) =>
      r.toObject<ReservationType>(),
    );

    return Object.assign({}, restaurantObj, {
      reservations: reservationsObj,
    }) as RestaurantType;
  }

  @ResolveField(() => Int)
  async reservationCount(
    @Parent() restaurant: RestaurantType,
  ): Promise<number> {
    return this.reservationService.countByRestaurant(restaurant.id);
  }
}
