import { Module } from '@nestjs/common';
import { RestaurantModule } from '../restaurants/restaurant.module';
import { ReservationModule } from '../reservations/reservation.module';

import { RestaurantResolver } from './restaurant.resolver';
import { ReservationResolver } from './reservation.resolver';

@Module({
  imports: [RestaurantModule, ReservationModule],
  providers: [RestaurantResolver, ReservationResolver],
})
export class BookingGraphQLModule {}
