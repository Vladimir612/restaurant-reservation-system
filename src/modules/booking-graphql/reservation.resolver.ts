import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { ReservationType } from './graphql-types/reservation.type';
import { ReservationService } from '../reservations/reservation.service';
import { RestaurantService } from '../restaurants/restaurant.service';
import { CreateReservationInput } from './graphql-types/create-reservation.input';
import { Roles } from '../auth/guards/graphql/roles.decorator';
import { GraphqlJwtAuthGuard } from '../auth/guards/graphql/graphql-jwt-auth.guard';
import { UserRole } from '../users/enums/user-role-enum';
import { UseGuards } from '@nestjs/common';
import { RestaurantScopeGuard } from '../auth/guards/graphql/restaurant-scope.guard';
import { RolesGuard } from '../auth/guards/graphql/roles.guard';

@Resolver(() => ReservationType)
export class ReservationResolver {
  constructor(
    private readonly reservationService: ReservationService,
    private readonly restaurantService: RestaurantService,
  ) {}

  @Mutation(() => ReservationType)
  @UseGuards(GraphqlJwtAuthGuard, RolesGuard, RestaurantScopeGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.RESTAURANT_ADMIN)
  async createReservation(@Args('data') data: CreateReservationInput) {
    const restaurant = await this.restaurantService.throwIfNotExists(
      data.restaurantId,
    );

    const dateUtc = new Date(data.date);

    return this.reservationService.createReservation({
      restaurant,
      dateUtc,
      guestName: data.guestName,
    });
  }
}
