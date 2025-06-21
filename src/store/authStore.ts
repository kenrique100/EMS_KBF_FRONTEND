import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { apiLogin, apiLogout, getCurrentUser, apiRefreshToken } from '@/api/auth';
import { Role, UserResponse } from '@/types';
import axios from 'axios';

interface AuthState {
  user: UserResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  initialized: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  initializeAuth: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
  hasRole: (role: Role) => boolean;
  setUser: (user: UserResponse | null) => void;
  clearAuth: () => void;
  getUserId: () => number | undefined;
}

export const useAuthStore = create<AuthState>()(
  immer((set, get) => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    initialized: false,

    login: async (username, password) => {
      set({ isLoading: true, error: null });
      try {
        const { accessToken, refreshToken, user } = await apiLogin({ username, password });

        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        set({ user, isAuthenticated: true });
      } catch (err) {
        let errorMessage = 'Login failed';

        if (axios.isAxiosError(err)) {
          if (err.response?.status === 401) {
            errorMessage = 'Invalid username or password';
          } else {
            errorMessage = err.response?.data?.message || err.message;
          }
        } else if (err instanceof Error) {
          errorMessage = err.message;
        }

        set({ error: errorMessage });
        throw new Error(errorMessage);
      } finally {
        set({ isLoading: false, initialized: true });
      }
    },

    logout: async () => {
      set({ isLoading: true });
      try {
        await apiLogout();
      } catch (err) {
        console.error('Logout error:', err);
      } finally {
        get().clearAuth();
        set({ isLoading: false });
      }
    },

    initializeAuth: async () => {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        set({ initialized: true });
        return;
      }

      set({ isLoading: true });
      try {
        const user = await getCurrentUser();
        set({ user, isAuthenticated: true });
      } catch (err) {
        if (!(await get().refreshToken())) {
          get().clearAuth();
        }
      } finally {
        set({ initialized: true, isLoading: false });
      }
    },

    refreshToken: async () => {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) return false;

      try {
        const { accessToken, refreshToken: newRefreshToken } = await apiRefreshToken(refreshToken);

        localStorage.setItem('accessToken', accessToken);
        if (newRefreshToken) {
          localStorage.setItem('refreshToken', newRefreshToken);
        }

        const user = await getCurrentUser();
        set({ user, isAuthenticated: true, error: null });
        return true;
      } catch (err) {
        get().clearAuth();
        set({ error: 'Session expired. Please login again.' });
        return false;
      }
    },

    clearAuth: () => {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      set({ user: null, isAuthenticated: false, error: null });
    },

    setUser: (user) => set({ user }),

    hasRole: (role) => {
      const { user } = get();
      return !!user?.roles?.includes(role);
    },

    getUserId: () => {
      const { user } = get();
      return user?.id;
    },
  }))
);