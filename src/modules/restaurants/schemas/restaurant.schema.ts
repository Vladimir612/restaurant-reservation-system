import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseEntity } from 'src/infrastructure/database/base.entity';

@Schema({ timestamps: true })
export class Restaurant extends BaseEntity {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  openHour: string;

  @Prop({ required: true })
  closeHour: string;

  @Prop({ type: String, required: true })
  timezone: string;
}

export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);

RestaurantSchema.virtual('id').get(function () {
  return this._id.toString();
});

RestaurantSchema.set('toJSON', { virtuals: true });
RestaurantSchema.set('toObject', { virtuals: true });
