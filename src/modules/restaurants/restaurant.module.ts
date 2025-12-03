import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Restaurant, RestaurantSchema } from './schemas/restaurant.schema';
import { RestaurantRepository } from './restaurant.repository';
import { RestaurantService } from './restaurant.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Restaurant.name, schema: RestaurantSchema },
    ]),
  ],
  providers: [RestaurantRepository, RestaurantService],
  exports: [RestaurantService, RestaurantRepository],
})
export class RestaurantModule {}
