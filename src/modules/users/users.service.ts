import { Injectable, ForbiddenException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Types } from 'mongoose';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDocument } from './schemas/user.schema';
import { UserRole } from './enums/user-role-enum';
import { CreateBootstrapUserDto } from './dto/create-bootstrap-user.dto';

@Injectable()
export class UsersService {
  private readonly SALT_ROUNDS = 10;

  constructor(private readonly userRepo: UserRepository) {}

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userRepo.findOne({ email: email.toLowerCase().trim() });
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.userRepo.findById(id);
  }

  async createUserAs(
    currentUser: { id: string; role: UserRole; restaurantId?: string | null },
    dto: CreateUserDto,
  ): Promise<UserDocument> {
    if (dto.role === UserRole.SUPER_ADMIN) {
      throw new ForbiddenException(
        'SuperAdmin users cannot be created via API.',
      );
    }

    const existing = await this.findByEmail(dto.email);
    if (existing) {
      throw new ForbiddenException('User with this email already exists.');
    }

    if (currentUser.role === UserRole.SUPER_ADMIN) {
      const passwordHash = await this.hashPassword(dto.password);
      return this.userRepo.create({
        email: dto.email.toLowerCase().trim(),
        password: passwordHash,
        role: dto.role,
        restaurantId: dto.restaurantId
          ? new Types.ObjectId(dto.restaurantId)
          : null,
      });
    }

    if (currentUser.role === UserRole.RESTAURANT_ADMIN) {
      if (!currentUser.restaurantId) {
        throw new ForbiddenException(
          'RestaurantAdmin must be assigned to a restaurant.',
        );
      }

      if (dto.restaurantId && dto.restaurantId !== currentUser.restaurantId) {
        throw new ForbiddenException(
          'RestaurantAdmin can only create users for their own restaurant.',
        );
      }

      const passwordHash = await this.hashPassword(dto.password);

      return this.userRepo.create({
        email: dto.email.toLowerCase().trim(),
        password: passwordHash,
        role: dto.role,
        restaurantId: new Types.ObjectId(currentUser.restaurantId),
      });
    }

    throw new ForbiddenException('You are not allowed to create users.');
  }

  private async hashPassword(rawPassword: string): Promise<string> {
    const salt = await bcrypt.genSalt(this.SALT_ROUNDS);
    return bcrypt.hash(rawPassword, salt);
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserDocument | null> {
    const user = await this.findByEmail(email);
    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return null;

    return user;
  }

  async createUserBootstrap(
    dto: CreateBootstrapUserDto,
  ): Promise<UserDocument> {
    const existing = await this.findByEmail(dto.email);
    if (existing) {
      throw new ForbiddenException('User with this email already exists.');
    }

    const passwordHash = await this.hashPassword(dto.password);

    return this.userRepo.create({
      email: dto.email.toLowerCase().trim(),
      password: passwordHash,
      role: UserRole.OPERATOR,
    });
  }
}
