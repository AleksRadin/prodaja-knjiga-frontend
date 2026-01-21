"use client";

import { createContext, type Dispatch, type SetStateAction } from "react";

export type UserRole = "ADMIN" | "REGULAR";

export type AuthData = {
  token: string;
  id: number | string;
  name: string;
  role: UserRole;
};

interface AuthContextType {
  isLoggedIn: boolean;
  isAuthLoading: boolean;
  error: string;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setError: Dispatch<SetStateAction<string>>;
  user: { id: number | string; name: string; role: UserRole } | null;
  register: (
    firstname: string,
    lastname: string,
    email: string,
    password: string,
    phoneNumber?: string
  ) => Promise<void>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<boolean>;
  requestReset: (email: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default AuthContext;
export type { AuthContextType };
