import { Injectable } from '@nestjs/common';
import { ReservationRepository } from './reservation.repository';
import { Types } from 'mongoose';

@Injectable()
export class ReservationService {
  constructor(private readonly reservationRepo: ReservationRepository) {}

  async createReservation(restaurantId: string, date: Date, guestName: string) {
    return this.reservationRepo.create({
      restaurantId: new Types.ObjectId(restaurantId),
      date,
      guestName,
    });
  }

  findByRestaurant(restaurantId: string) {
    return this.reservationRepo.findManyByFilter({
      restaurantId: new Types.ObjectId(restaurantId),
    });
  }
}
