import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtPayload } from '../auth.service';
import { UserRole } from 'src/modules/users/enums/user-role-enum';

interface RequestWithUser extends Request {
  user?: JwtPayload;
}

@Injectable()
export class CreateUserGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<RequestWithUser>();
    const user = req.user;

    if (!user) {
      throw new ForbiddenException('Missing authenticated user.');
    }

    if (
      user.role !== UserRole.SUPER_ADMIN &&
      user.role !== UserRole.RESTAURANT_ADMIN
    ) {
      throw new ForbiddenException(
        'Only SuperAdmin and RestaurantAdmin can create users.',
      );
    }

    if (user.role === UserRole.RESTAURANT_ADMIN && !user.restaurantId) {
      throw new ForbiddenException(
        'RestaurantAdmin must be assigned to a restaurant.',
      );
    }

    return true;
  }
}
