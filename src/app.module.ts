import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './infrastructure/database/database.module';
import { HealthModule } from './modules/health/health.module';
import { RestaurantModule } from './modules/restaurants/restaurant.module';
import { ReservationModule } from './modules/reservations/reservation.module';
import { BookingGraphQLModule } from './modules/booking-graphql/booking-graphql.module';
import { GraphqlInfraModule } from './infrastructure/graphql/graphql.module';
import { GraphqlScalarsModule } from './common/graphql/scalars/graphql.scalars.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GraphqlInfraModule,
    DatabaseModule,
    HealthModule,
    RestaurantModule,
    ReservationModule,
    BookingGraphQLModule,
    GraphqlScalarsModule,
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
