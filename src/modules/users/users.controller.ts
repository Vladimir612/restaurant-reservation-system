import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiCreatedResponse } from '@nestjs/swagger';
import type { Request } from 'express';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateBootstrapUserDto } from './dto/create-bootstrap-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateUserGuard } from '../auth/guards/create-user.guard';
import { JwtPayload } from '../auth/auth.service';

interface RequestWithUser extends Request {
  user?: JwtPayload;
}

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseGuards(JwtAuthGuard, CreateUserGuard)
  @ApiOperation({ summary: 'Create a user (requires role-based permissions)' })
  @ApiCreatedResponse({
    description: 'User successfully created',
    schema: {
      example: {
        id: '675abc123...',
        email: 'operator@test.com',
        role: 'OPERATOR',
        restaurantId: '674ddc123...',
      },
    },
  })
  async createUser(@Req() req: RequestWithUser, @Body() dto: CreateUserDto) {
    const currentUser = req.user!;

    const created = await this.usersService.createUserAs(
      {
        id: currentUser.sub,
        role: currentUser.role,
        restaurantId: currentUser.restaurantId,
      },
      dto,
    );

    return {
      id: created.id,
      email: created.email,
      role: created.role,
      restaurantId: created.restaurantId?.toString() ?? null,
    };
  }

  @Post('bootstrap')
  @ApiOperation({
    summary: 'Bootstrap user creation (DEV ONLY)',
    description:
      'Creates a user with role Operator without any authorization checks. Used for initializing the system.',
  })
  @ApiCreatedResponse({
    description: 'Bootstrap user created',
    schema: {
      example: {
        id: '675abc123...',
        email: 'user@test.com',
        role: 'OPERATOR',
        restaurantId: null,
      },
    },
  })
  async createBootstrapUser(@Body() dto: CreateBootstrapUserDto) {
    const created = await this.usersService.createUserBootstrap(dto);

    return {
      id: created.id,
      email: created.email,
      role: created.role,
      restaurantId: created.restaurantId?.toString() ?? null,
    };
  }
}
