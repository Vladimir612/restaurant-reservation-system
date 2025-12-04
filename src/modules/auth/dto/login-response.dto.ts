export interface UserDto {
  id: string;
  email: string;
  role: string;
  restaurantId: string | null;
}

export interface LoginResponseDto {
  accessToken: string;
  user: UserDto;
}
