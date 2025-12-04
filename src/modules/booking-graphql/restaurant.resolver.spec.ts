import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantResolver } from './restaurant.resolver';
import { RestaurantService } from '../restaurants/restaurant.service';
import { ReservationService } from '../reservations/reservation.service';
import { RestaurantDocument } from '../restaurants/schemas/restaurant.schema';
import { ReservationDocument } from '../reservations/schemas/reservation.schema';
import { Types } from 'mongoose';

describe('RestaurantResolver', () => {
  let resolver: RestaurantResolver;
  let restaurantService: jest.Mocked<RestaurantService>;
  let reservationService: jest.Mocked<ReservationService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RestaurantResolver,
        {
          provide: RestaurantService,
          useValue: {
            findById: jest.fn(),
          },
        },
        {
          provide: ReservationService,
          useValue: {
            findByRestaurant: jest.fn(),
            countByRestaurant: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get(RestaurantResolver);
    restaurantService = module.get(RestaurantService);
    reservationService = module.get(ReservationService);
  });

  it('should return restaurant with reservations', async () => {
    const restaurant: RestaurantDocument = {
      _id: new Types.ObjectId(),
      id: '507f1f77bcf86cd799439011',
      name: 'Test',
      openHour: '10:00',
      closeHour: '22:00',
      timezone: 'UTC',
      createdAt: new Date(),
      updatedAt: new Date(),
      toObject: () => ({
        _id: new Types.ObjectId(),
        id: '507f1f77bcf86cd799439011',
        name: 'Test',
        openHour: '10:00',
        closeHour: '22:00',
        timezone: 'UTC',
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    } as RestaurantDocument;

    const reservations: ReservationDocument[] = [
      {
        _id: new Types.ObjectId(),
        id: 'r1',
        restaurantId: new Types.ObjectId('507f1f77bcf86cd799439011'),
        guestName: 'John',
        date: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        toObject: () => ({
          _id: new Types.ObjectId(),
          id: 'r1',
          restaurantId: new Types.ObjectId('507f1f77bcf86cd799439011'),
          guestName: 'John',
          date: new Date(),
        }),
      } as ReservationDocument,
    ];

    restaurantService.findById.mockResolvedValue(restaurant);
    reservationService.findByRestaurant.mockResolvedValue(reservations);

    const result = await resolver.getRestaurant('507f1f77bcf86cd799439011');

    expect(result).not.toBeNull();
    if (!result) throw new Error('Result unexpectedly null');

    expect(result.id).toBe('507f1f77bcf86cd799439011');
    expect(result.reservations).toBeDefined();
    expect(result.reservations?.length).toBe(1);
  });

  it('should return null if restaurant not found', async () => {
    restaurantService.findById.mockResolvedValue(null);

    const result = await resolver.getRestaurant('notfound');
    expect(result).toBeNull();
  });

  it('should return reservationCount', async () => {
    reservationService.countByRestaurant.mockResolvedValue(5);

    const restaurant = {
      _id: new Types.ObjectId(),
      id: '507f1f77bcf86cd799439011',
      name: 'Test Restaurant',
      openHour: '10:00',
      closeHour: '22:00',
      timezone: 'UTC',
      createdAt: new Date(),
      updatedAt: new Date(),
    } as RestaurantDocument;

    const result = await resolver.reservationCount(restaurant);

    expect(result).toBe(5);
    expect(reservationService.countByRestaurant).toHaveBeenCalledWith(
      '507f1f77bcf86cd799439011',
    );
  });
});
