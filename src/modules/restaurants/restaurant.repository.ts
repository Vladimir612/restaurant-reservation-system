import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Restaurant } from './schemas/restaurant.schema';
import { BaseRepository } from 'src/infrastructure/database/base.repository';

@Injectable()
export class RestaurantRepository extends BaseRepository<Restaurant> {
  constructor(@InjectModel(Restaurant.name) model: Model<Restaurant>) {
    super(model);
  }
}
