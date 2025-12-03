import { Injectable, NotFoundException } from '@nestjs/common';
import { RestaurantRepository } from './restaurant.repository';

@Injectable()
export class RestaurantService {
  constructor(private readonly restaurantRepo: RestaurantRepository) {}

  async findById(id: string) {
    return this.restaurantRepo.findById(id);
  }

  async throwIfNotExists(id: string) {
    const restaurant = await this.restaurantRepo.findById(id);

    if (!restaurant) throw new NotFoundException('Restaurant not found');

    return restaurant;
  }
}
