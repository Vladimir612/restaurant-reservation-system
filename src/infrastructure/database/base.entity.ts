import { Document } from 'mongoose';
import { Prop } from '@nestjs/mongoose';

export abstract class BaseEntity extends Document {
  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}
