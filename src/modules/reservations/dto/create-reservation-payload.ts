import { Restaurant } from 'src/modules/restaurants/schemas/restaurant.schema';

export class CreateReservationPayload {
  restaurant!: Restaurant;
  dateUtc!: Date;
  guestName!: string;
}
