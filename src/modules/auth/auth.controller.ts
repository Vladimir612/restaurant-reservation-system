import {
  Body,
  Controller,
  Post,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './login.dto';
import { UserDto } from './dto/login-response.dto';

@ApiTags('Auth')
@Controller('auth')
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login and receive HTTP-only JWT cookie' })
  @ApiOkResponse({
    description: 'Returns user info and sets JWT cookie',
    schema: {
      example: {
        user: {
          id: '675abc123...',
          email: 'admin@test.com',
          role: 'SuperAdmin',
          restaurantId: null,
        },
      },
    },
  })
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<UserDto> {
    const { accessToken, user } = await this.authService.login(dto);

    res.cookie('Authentication', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    return user;
  }
}
