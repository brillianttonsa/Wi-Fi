import { apiRequest } from "./api";
import type { AuthUser } from "./authApi";

export type UpdateProfileData = {
  fullName: string;
  phone: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
};

export function updateProfileRequest(data: UpdateProfileData) {
  return apiRequest<{ user: AuthUser }>("/api/profile", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}
