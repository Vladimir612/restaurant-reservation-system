import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { BaseEntity } from 'src/infrastructure/database/base.entity';
import { UserRole } from '../enums/user-role-enum';

@Schema({ timestamps: true })
export class User extends BaseEntity {
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: String, enum: UserRole, required: true })
  role: UserRole;

  @Prop({ type: Types.ObjectId, ref: 'Restaurant', required: false })
  restaurantId?: Types.ObjectId | null;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
