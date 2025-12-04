import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { UserRole } from 'src/modules/users/enums/user-role-enum';
import { GraphQLContext } from '../types/request.types';

interface RestaurantArgs {
  id?: string;
  restaurantId?: string;
  data?: {
    restaurantId?: string;
    id?: string;
  };
}

@Injectable()
export class RestaurantScopeGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext<GraphQLContext>();

    const user = req.user;
    const args = ctx.getArgs<RestaurantArgs>();

    const restaurantId =
      args.id || args.restaurantId || args.data?.restaurantId || args.data?.id;

    if (user.role === UserRole.SUPER_ADMIN) {
      return true;
    }

    if (!restaurantId) {
      throw new ForbiddenException('Restaurant ID is required');
    }

    if (user.restaurantId !== restaurantId) {
      throw new ForbiddenException('You can only access your own restaurant');
    }

    return true;
  }
}
