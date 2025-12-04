import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Reservation } from './schemas/reservation.schema';
import { BaseRepository } from 'src/infrastructure/database/base.repository';

@Injectable()
export class ReservationRepository extends BaseRepository<Reservation> {
  constructor(
    @InjectModel(Reservation.name)
    model: Model<Reservation>,
  ) {
    super(model);
  }
}
