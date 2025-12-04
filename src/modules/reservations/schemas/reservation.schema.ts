import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { BaseEntity } from 'src/infrastructure/database/base.entity';

@Schema({ timestamps: true })
export class Reservation extends BaseEntity {
  declare id: string;

  @Prop({ type: Types.ObjectId, ref: 'Restaurant', required: true })
  restaurantId!: Types.ObjectId;

  @Prop({ required: true })
  guestName!: string;

  @Prop({ type: Date, required: true })
  date!: Date;
}

export type ReservationDocument = Reservation;

export const ReservationSchema = SchemaFactory.createForClass(Reservation);

ReservationSchema.virtual('id').get(function () {
  return this._id.toString();
});

ReservationSchema.set('toJSON', { virtuals: true });
ReservationSchema.set('toObject', { virtuals: true });
