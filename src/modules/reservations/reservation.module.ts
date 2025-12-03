import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Reservation, ReservationSchema } from './schemas/reservation.schema';
import { ReservationRepository } from './reservation.repository';
import { ReservationService } from './reservation.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Reservation.name, schema: ReservationSchema },
    ]),
  ],
  providers: [ReservationRepository, ReservationService],
  exports: [ReservationService, ReservationRepository],
})
export class ReservationModule {}
