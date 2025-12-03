import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { UserRole } from 'src/modules/users/enums/user-role-enum';

@Injectable()
export class RestaurantScopeGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext().req;

    const user = req.user;
    const args = ctx.getArgs();

    const restaurantId = args.id || args.restaurantId;

    if (user.role === UserRole.SUPER_ADMIN) return true;

    if (!restaurantId) return true;

    if (
      user.role === UserRole.RESTAURANT_ADMIN ||
      user.role === UserRole.OPERATOR
    ) {
      if (user.restaurantId !== restaurantId) {
        throw new ForbiddenException('You can only access your own restaurant');
      }
      return true;
    }

    return true;
  }
}
