import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User } from '../types';
import { authApi } from '../api';

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authApi.login(email, password);
          const { token, user } = response.data;

          sessionStorage.setItem('token', token);
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false
          });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.message || 'Login failed'
          });
          throw error;
        }
      },

      logout: () => {
        sessionStorage.removeItem('token');
        set({ user: null, token: null, isAuthenticated: false });
      },

      changePassword: async (currentPassword: string, newPassword: string) => {
        set({ isLoading: true, error: null });
        try {
          await authApi.changePassword(currentPassword, newPassword);
          set({ isLoading: false });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.message || 'Password change failed'
          });
          throw error;
        }
      },

      checkAuth: async () => {
        const token = sessionStorage.getItem('token');
        if (!token) {
          set({ isAuthenticated: false, user: null, isLoading: false });
          return;
        }

        set({ isLoading: true, error: null });

        try {
          const response = await authApi.getMe();
          set({
            user: response.data.user,
            token,
            isAuthenticated: true,
            isLoading: false
          });
        } catch {
          sessionStorage.removeItem('token');
          set({ user: null, token: null, isAuthenticated: false, isLoading: false });
        }
      }
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ token: state.token, user: state.user })
    }
  )
);
