import { BadRequestException, Injectable } from '@nestjs/common';
import { ReservationRepository } from './reservation.repository';
import { Types } from 'mongoose';
import { CreateReservationPayload } from './dto/create-reservation-payload';
import { DateTime } from 'luxon';

const BUFFER_MINUTES_BEFORE_CLOSE = 30;

@Injectable()
export class ReservationService {
  constructor(private readonly reservationRepo: ReservationRepository) {}

  async createReservation(payload: CreateReservationPayload) {
    const { restaurant, dateUtc, guestName } = payload;

    const localDate = DateTime.fromJSDate(dateUtc, { zone: 'utc' }).setZone(
      restaurant.timezone,
    );

    if (!localDate.isValid) {
      throw new BadRequestException('Invalid date conversion');
    }

    const [openH, openM] = restaurant.openHour.split(':').map(Number);
    const [closeH, closeM] = restaurant.closeHour.split(':').map(Number);

    const openDate = localDate.set({ hour: openH, minute: openM, second: 0 });
    const closeDate = localDate.set({
      hour: closeH,
      minute: closeM,
      second: 0,
    });

    if (localDate < openDate || localDate > closeDate) {
      throw new BadRequestException(
        `Reservation time must be between ${restaurant.openHour} and ${restaurant.closeHour} (${restaurant.timezone})`,
      );
    }

    const bufferCloseDate = closeDate.minus({
      minutes: BUFFER_MINUTES_BEFORE_CLOSE,
    });

    if (localDate > bufferCloseDate) {
      throw new BadRequestException(
        `Reservations must be made at least ${BUFFER_MINUTES_BEFORE_CLOSE} minutes before closing time (${restaurant.closeHour}).`,
      );
    }

    return this.reservationRepo.create({
      restaurantId: new Types.ObjectId(restaurant._id),
      date: dateUtc,
      guestName,
    });
  }

  findByRestaurant(restaurantId: string) {
    return this.reservationRepo.findManyByFilter({
      restaurantId: new Types.ObjectId(restaurantId),
    });
  }

  async countByRestaurant(restaurantId: string): Promise<number> {
    return this.reservationRepo.count({
      restaurantId: new Types.ObjectId(restaurantId),
    } as any);
  }
}
