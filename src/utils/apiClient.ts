import axios, { AxiosError, InternalAxiosRequestConfig, AxiosRequestConfig } from 'axios';
import { notify } from '@/store/notificationService';
import { useAuthStore } from '@/store/authStore';

declare module 'axios' {
  interface AxiosRequestConfig {
    _retry?: boolean;
    skipAuthRefresh?: boolean;
    skipErrorNotification?: boolean;
  }
}

interface ApiErrorResponse {
  message?: string;
  error?: string;
  statusCode?: number;
  [key: string]: unknown;
}

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().getAccessToken();

    if (token && !config.headers?.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Special handling for file uploads
    if (config.url?.includes('/profile-pictures')) {
      config.withCredentials = true;
      if (config.headers && config.data instanceof FormData) {
        config.headers['Content-Type'] = 'multipart/form-data';
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  response => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
      skipAuthRefresh?: boolean;
      skipErrorNotification?: boolean;
    };

    // Ensure originalRequest exists
    if (!originalRequest) {
      return Promise.reject(error);
    }

    // Skip handling if marked to skip
    if (originalRequest.skipAuthRefresh || originalRequest.skipErrorNotification) {
      return Promise.reject(error);
    }

    // Handle 401 Unauthorized
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/')
    ) {
      originalRequest._retry = true;

      try {
        const refreshed = await useAuthStore.getState().refreshToken();
        if (refreshed) {
          const newToken = useAuthStore.getState().getAccessToken();
          if (newToken) {
            if (!originalRequest.headers) {
              originalRequest.headers = {};
            }
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return apiClient(originalRequest); // ✅ No TS error now
          }
        }
      } catch (refreshError) {
        useAuthStore.getState().clearAuth();
        if (!originalRequest.skipErrorNotification) {
          notify('Session expired. Please login again.', 'error');
        }
        return Promise.reject(error);
      }
    }

    // Handle other errors
    if (!originalRequest.skipErrorNotification) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'An unexpected error occurred';

      if (error.response?.status !== 401) {
        notify(errorMessage, 'error');
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
