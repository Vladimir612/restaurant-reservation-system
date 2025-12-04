import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import request from 'supertest';

import { ReservationResolver } from 'src/modules/booking-graphql/reservation.resolver';
import { RestaurantResolver } from 'src/modules/booking-graphql/restaurant.resolver';

import { ReservationService } from 'src/modules/reservations/reservation.service';
import { RestaurantService } from 'src/modules/restaurants/restaurant.service';

import { GraphqlJwtAuthGuard } from 'src/modules/auth/guards/graphql/graphql-jwt-auth.guard';
import { RolesGuard } from 'src/modules/auth/guards/graphql/roles.guard';
import { RestaurantScopeGuard } from 'src/modules/auth/guards/graphql/restaurant-scope.guard';

describe('ReservationResolver (integration)', () => {
  let app: INestApplication;
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
        ReservationResolver,
        {
          provide: ReservationService,
          useValue: {
            createReservation: jest.fn().mockResolvedValue({
              id: 'r1',
              restaurantId: '507f1f77bcf86cd799439011',
              guestName: 'John',
              date: new Date('2025-05-01T12:00:00Z'),
            }),
          },
        },
        {
          provide: RestaurantService,
          useValue: {
            throwIfNotExists: jest.fn().mockResolvedValue({
              id: '507f1f77bcf86cd799439011',
              timezone: 'UTC',
            }),
          },
        },
      ],
    })
      .overrideGuard(GraphqlJwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RestaurantScopeGuard)
      .useValue({ canActivate: () => true })
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();

    reservationService = moduleRef.get<ReservationService>(ReservationService);
  });

  afterAll(async () => {
    await app.close();
  });

  it('creates reservation via mutation', async () => {
    const mutation = `
      mutation {
        createReservation(data: {
          restaurantId: "507f1f77bcf86cd799439011",
          guestName: "John",
          date: "2025-05-01T12:00:00Z"
        }) {
          id
          restaurantId
          guestName
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: mutation })
      .expect(200);

    expect(response.body.data.createReservation).toEqual({
      id: 'r1',
      restaurantId: '507f1f77bcf86cd799439011',
      guestName: 'John',
    });

    expect(reservationService.createReservation).toHaveBeenCalled();
  });

  it('handles validation errors', async () => {
    jest
      .spyOn(reservationService, 'createReservation')
      .mockRejectedValueOnce(new Error('Invalid date'));

    const mutation = `
      mutation {
        createReservation(data: {
          restaurantId: "507f1f77bcf86cd799439011",
          guestName: "John",
          date: "invalid-date"
        }) {
          id
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: mutation });

    expect(response.body.errors).toBeDefined();
  });
});
