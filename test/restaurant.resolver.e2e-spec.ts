import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import request, { Response } from 'supertest';

import { RestaurantService } from 'src/modules/restaurants/restaurant.service';
import { ReservationService } from 'src/modules/reservations/reservation.service';
import { RestaurantResolver } from 'src/modules/booking-graphql/restaurant.resolver';
import { GraphqlJwtAuthGuard } from 'src/modules/auth/guards/graphql/graphql-jwt-auth.guard';
import { RestaurantScopeGuard } from 'src/modules/auth/guards/graphql/restaurant-scope.guard';

describe('RestaurantResolver (integration)', () => {
  let app: INestApplication;
  let restaurantService: RestaurantService;
  let reservationService: ReservationService;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        GraphQLModule.forRoot<ApolloDriverConfig>({
          driver: ApolloDriver,
          autoSchemaFile: true,
        }),
      ],
      providers: [
        RestaurantResolver,
        {
          provide: RestaurantService,
          useValue: {
            findById: jest.fn().mockResolvedValue({
              id: '507f1f77bcf86cd799439011',
              name: 'Test',
              openHour: '10:00',
              closeHour: '22:00',
              timezone: 'UTC',
              toObject: () => ({
                id: '507f1f77bcf86cd799439011',
                name: 'Test',
                openHour: '10:00',
                closeHour: '22:00',
                timezone: 'UTC',
              }),
            }),
          },
        },
        {
          provide: ReservationService,
          useValue: {
            findByRestaurant: jest.fn().mockResolvedValue([
              {
                id: 'r1',
                restaurantId: '507f1f77bcf86cd799439011',
                guestName: 'John',
                date: new Date('2025-05-01T12:00:00Z'),
                toObject: () => ({
                  id: 'r1',
                  restaurantId: '507f1f77bcf86cd799439011',
                  guestName: 'John',
                  date: new Date('2025-05-01T12:00:00Z'),
                }),
              },
            ]),
            countByRestaurant: jest.fn().mockResolvedValue(1),
          },
        },
      ],
    })
      .overrideGuard(GraphqlJwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RestaurantScopeGuard)
      .useValue({ canActivate: () => true })
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();

    restaurantService = moduleRef.get<RestaurantService>(RestaurantService);
    reservationService = moduleRef.get<ReservationService>(ReservationService);
  });

  afterAll(async () => {
    await app.close();
  });

  it('fetches restaurant with reservations', async () => {
    const query = `
      query {
        getRestaurant(id: "507f1f77bcf86cd799439011") {
          id
          name
          reservationCount
          reservations {
            id
            guestName
          }
        }
      }
    `;

    const response: Response = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query })
      .expect(200);

    expect(response.body.data?.getRestaurant).toEqual({
      id: '507f1f77bcf86cd799439011',
      name: 'Test',
      reservationCount: 1,
      reservations: [
        {
          id: 'r1',
          guestName: 'John',
        },
      ],
    });

    expect(restaurantService.findById).toHaveBeenCalledWith(
      '507f1f77bcf86cd799439011',
    );
    expect(reservationService.findByRestaurant).toHaveBeenCalledWith(
      '507f1f77bcf86cd799439011',
    );
    expect(reservationService.countByRestaurant).toHaveBeenCalledWith(
      '507f1f77bcf86cd799439011',
    );
  });

  it('handles restaurant not found', async () => {
    jest.spyOn(restaurantService, 'findById').mockResolvedValueOnce(null);

    const query = `
      query {
        getRestaurant(id: "nonexistent") {
          id
          name
        }
      }
    `;

    const response: Response = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query });

    expect(response.body.data?.getRestaurant).toBeNull();
  });

  it('fetches restaurant without reservations field', async () => {
    const query = `
      query {
        getRestaurant(id: "507f1f77bcf86cd799439011") {
          id
          name
          reservationCount
        }
      }
    `;

    const response: Response = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query })
      .expect(200);

    expect(response.body.data?.getRestaurant).toEqual({
      id: '507f1f77bcf86cd799439011',
      name: 'Test',
      reservationCount: 1,
    });

    expect(restaurantService.findById).toHaveBeenCalled();
  });
});
