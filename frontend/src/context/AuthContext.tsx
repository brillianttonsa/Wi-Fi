import { useCallback, useEffect, useState, type ReactNode } from "react";
import { ApiError } from "../services/api";
import {
  currentUserRequest,
  loginRequest,
  logoutRequest,
  registerRequest,
  type AuthUser,
  type RegisterData,
} from "../services/authApi";
import { updateProfileRequest, type UpdateProfileData } from "../services/profileApi";
import { AuthContext } from "./AuthContextStore";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const response = await currentUserRequest();
      setUser(response.user);
    } catch (error) {
      if (!(error instanceof ApiError) || error.status !== 401) throw error;
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => void refreshUser().catch((error: unknown) => {
      console.error("Unable to restore the current session.", error);
    }), 0);
    return () => window.clearTimeout(timeout);
  }, [refreshUser]);

  const login = async (phone: string, password: string) => {
    const response = await loginRequest(phone, password);
    setUser(response.user);
  };

  const register = async (data: RegisterData) => {
    const response = await registerRequest(data);
    setUser(response.user);
  };

  const logout = async () => {
    await logoutRequest();
    setUser(null);
  };

  const updateProfile = async (data: UpdateProfileData) => {
    const response = await updateProfileRequest(data);
    setUser(response.user);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}
