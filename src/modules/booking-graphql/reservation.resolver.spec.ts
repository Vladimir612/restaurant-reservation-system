import { Test, TestingModule } from '@nestjs/testing';
import { ReservationResolver } from './reservation.resolver';
import { ReservationService } from '../reservations/reservation.service';
import { RestaurantService } from '../restaurants/restaurant.service';
import { RestaurantDocument } from '../restaurants/schemas/restaurant.schema';
import { ReservationDocument } from '../reservations/schemas/reservation.schema';
import { Types } from 'mongoose';

describe('ReservationResolver', () => {
  let resolver: ReservationResolver;
  let reservationService: jest.Mocked<ReservationService>;
  let restaurantService: jest.Mocked<RestaurantService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationResolver,
        {
          provide: ReservationService,
          useValue: {
            createReservation: jest.fn(),
          },
        },
        {
          provide: RestaurantService,
          useValue: {
            throwIfNotExists: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get(ReservationResolver);
    reservationService = module.get(ReservationService);
    restaurantService = module.get(RestaurantService);
  });

  it('should create reservation successfully', async () => {
    const input = {
      restaurantId: '507f1f77bcf86cd799439011',
      guestName: 'John',
      date: '2025-05-01T12:00:00Z',
    };

    const fakeRestaurant = {
      id: '507f1f77bcf86cd799439011',
      timezone: 'UTC',
      name: 'Test Restaurant',
      openHour: '10:00',
      closeHour: '22:00',
    } as RestaurantDocument;
    restaurantService.throwIfNotExists.mockResolvedValue(fakeRestaurant);

    const fakeReservation = {
      id: '1',
      restaurantId: new Types.ObjectId(input.restaurantId),
      guestName: 'John',
      date: new Date(input.date),
    } as ReservationDocument;

    reservationService.createReservation.mockResolvedValue(fakeReservation);

    const result = await resolver.createReservation(input);

    expect(restaurantService.throwIfNotExists).toHaveBeenCalledWith(
      input.restaurantId,
    );

    expect(reservationService.createReservation).toHaveBeenCalledWith({
      restaurant: fakeRestaurant,
      dateUtc: new Date(input.date),
      guestName: input.guestName,
    });

    expect(result).toEqual({
      id: '1',
      restaurantId: input.restaurantId,
      guestName: 'John',
      date: new Date(input.date),
    });
  });
});
