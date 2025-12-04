import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsMongoId,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { UserRole } from '../enums/user-role-enum';

export class CreateUserDto {
  @ApiProperty({ example: 'new.operator@test.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'Password123!' })
  @IsString()
  @MinLength(8)
  password!: string;

  @ApiProperty({
    enum: UserRole,
    example: UserRole.OPERATOR,
  })
  @IsEnum(UserRole)
  role!: UserRole;

  @ApiProperty({
    example: '675aaa000000000000000111',
    required: false,
  })
  @IsOptional()
  @IsMongoId()
  restaurantId?: string;
}
