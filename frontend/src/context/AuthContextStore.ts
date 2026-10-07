import { createContext } from "react";
import type { AuthUser, RegisterData } from "../services/authApi";
import type { UpdateProfileData } from "../services/profileApi";

export type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  login: (phone: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: UpdateProfileData) => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);
