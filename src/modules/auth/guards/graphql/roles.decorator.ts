import { CustomDecorator, SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/modules/users/enums/user-role-enum';

export const Roles = (...roles: UserRole[]): CustomDecorator =>
  SetMetadata('roles', roles);
