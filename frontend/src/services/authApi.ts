import { apiRequest } from "./api";

export type AuthUser = {
  id: number;
  fullName: string;
  phone: string;
  email: string | null;
  createdAt: string;
  updatedAt: string;
};

type AuthResponse = { user: AuthUser };

export type RegisterData = {
  fullName: string;
  phone: string;
  email?: string;
  password: string;
};

export function loginRequest(phone: string, password: string) {
  return apiRequest<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ phone, password }),
  });
}

export function registerRequest(data: RegisterData) {
  return apiRequest<AuthResponse>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function currentUserRequest() {
  return apiRequest<AuthResponse>("/api/auth/me");
}

export function logoutRequest() {
  return apiRequest<void>("/api/auth/logout", { method: "POST" });
}
