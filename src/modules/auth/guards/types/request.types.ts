import { UserRole } from 'src/modules/users/enums/user-role-enum';

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
  restaurantId: string | null;
}

export interface RequestWithUser {
  user: JwtPayload;
}

export interface GraphQLContext {
  req: RequestWithUser;
}
