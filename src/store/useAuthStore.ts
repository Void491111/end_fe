import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AxiosError } from "axios";
import { User } from "@/types/user";
import { authApi } from "@/lib/api";

interface AuthState {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,

      login: async (email, password) => {
        try {
          const { data } = await authApi.login(email, password);
          // Save token to localStorage (untuk api.ts interceptor)
          localStorage.setItem("auth_token", data.token);
          set({ user: data.user, token: data.token });
        } catch (error) {
          if (error instanceof AxiosError) {
            const message =
              error.response?.data?.errors?.email?.[0] ||
              error.response?.data?.message ||
              "Login gagal, coba lagi";
            throw new Error(message);
          }
          throw error;
        }
      },

      logout: async () => {
        try {
          await authApi.logout();
        } catch {
          // walaupun API call gagal, tetep clear local state
        }
        localStorage.removeItem("auth_token");
        set({ user: null, token: null });
      },

      isAuthenticated: () => !!get().token,
    }),
    { name: "mooiste-auth" }
  )
);