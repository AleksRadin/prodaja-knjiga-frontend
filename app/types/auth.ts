export type UserRole = "ADMIN" | "REGULAR";

export interface AuthUser {
  id: number | string;
  name: string;
  role: UserRole;
}

export interface AuthData {
  token: string;
  id: number | string;
  name: string;
  role: UserRole;
}

export interface UserDetails {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  phoneNumber?: string;
}
