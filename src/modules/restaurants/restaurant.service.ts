import { Injectable, NotFoundException } from '@nestjs/common';
import { RestaurantRepository } from './restaurant.repository';
import { RestaurantDocument } from './schemas/restaurant.schema';

@Injectable()
export class RestaurantService {
  constructor(private readonly restaurantRepo: RestaurantRepository) {}

  async findById(id: string): Promise<RestaurantDocument | null> {
    return this.restaurantRepo.findById(id);
  }

  async throwIfNotExists(id: string): Promise<RestaurantDocument> {
    const restaurant = await this.restaurantRepo.findById(id);

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }

    return restaurant;
  }
}
