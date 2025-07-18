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
  hasAnyRole: (roles: Role[]) => boolean;
  setUser: (user: UserResponse | null) => void;
  clearAuth: () => void;
  getUserId: () => number | undefined;
  getAccessToken: () => string | null;
}

const tokenStorage = {
  getAccessToken: () => localStorage.getItem('accessToken'),
  getRefreshToken: () => localStorage.getItem('refreshToken'),
  setTokens: (accessToken: string, refreshToken: string) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
  },
  clearTokens: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    delete axios.defaults.headers.common['Authorization'];
  },
};

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
          tokenStorage.setTokens(accessToken, refreshToken);
          set({ user, isAuthenticated: true, error: null });
        } catch (err) {
          let errorMessage = 'Login failed';
          if (axios.isAxiosError(err)) {
            errorMessage = err.response?.data?.message || err.message;
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
          const accessToken = tokenStorage.getAccessToken();
          if (accessToken) {
            await apiLogout();
          }
        } catch (err) {
          console.error('Logout error:', err);
        } finally {
          get().clearAuth();
          set({ isLoading: false });
        }
      },

      initializeAuth: async () => {
        if (get().initialized) return;

        const accessToken = tokenStorage.getAccessToken();
        if (!accessToken) {
          set({ initialized: true });
          return;
        }

        set({ isLoading: true });
        try {
          const user = await getCurrentUser();
          set({ user, isAuthenticated: true, error: null });
        } catch (err) {
          if (!(await get().refreshToken())) {
            get().clearAuth();
          }
        } finally {
          set({ initialized: true, isLoading: false });
        }
      },

      refreshToken: async () => {
        const refreshToken = tokenStorage.getRefreshToken();
        if (!refreshToken) return false;

        try {
          const { accessToken, refreshToken: newRefreshToken } = await apiRefreshToken(refreshToken);
          tokenStorage.setTokens(accessToken, newRefreshToken || refreshToken);

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
        tokenStorage.clearTokens();
        set({ user: null, isAuthenticated: false, error: null });
      },

      setUser: (user) => set({ user }),

      hasRole: (role) => {
        const { user } = get();
        return !!user?.roles?.includes(role);
      },

      hasAnyRole: (roles) => {
        const { user } = get();
        return roles.some(role => user?.roles?.includes(role));
      },

      getUserId: () => {
        const { user } = get();
        return user?.id;
      },

      getAccessToken: () => {
        return tokenStorage.getAccessToken();
      },
    })
  ));

// Axios response interceptor for token refresh
axios.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    const authStore = useAuthStore.getState();

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      authStore.getAccessToken() &&
      !originalRequest.url?.includes('/auth/')
    ) {
      originalRequest._retry = true;

      const refreshed = await authStore.refreshToken();
      if (refreshed) {
        const newAccessToken = authStore.getAccessToken();
        if (newAccessToken) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axios(originalRequest);
        }
      }
    }

    return Promise.reject(error);
  }
);