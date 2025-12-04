import { UserRole } from '../enums/user-role-enum';

export interface UserResponse {
  id: string;
  email: string;
  role: UserRole;
  restaurantId: string | null;
}
