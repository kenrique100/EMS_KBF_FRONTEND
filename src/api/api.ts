import axios, {
    AxiosError,
    AxiosRequestConfig,
    AxiosResponse,
    InternalAxiosRequestConfig,
} from 'axios';
import {
    getAuthToken,
    getRefreshToken,
    setAuthToken,
    clearAuthToken,
    clearRefreshToken,
} from '../utils/auth';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
});

let isRefreshing = false;
let failedQueue: Array<{ resolve: (value: string) => void; reject: (reason?: any) => void }> = [];

const processQueue = (error: AxiosError | null, token: string | null = null): void => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token!);
        }
    });
    failedQueue = [];
};

// ✅ Use correct InternalAxiosRequestConfig for request interceptor
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
        const token = getAuthToken();
        if (token) {
            config.headers = config.headers || {};
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError) => Promise.reject(error)
);

api.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token: unknown) => {
                        // ✅ Check if token is a string
                        if (typeof token === 'string') {
                            originalRequest.headers = originalRequest.headers || {};
                            originalRequest.headers['Authorization'] = 'Bearer ' + token;
                            return api(originalRequest);
                        }
                        return Promise.reject('Invalid token type');
                    })
                    .catch(err => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const refreshToken = getRefreshToken();
                const response = await axios.post(
                    `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'}/auth/refresh`,
                    { refreshToken }
                );
                const { accessToken } = response.data;
                setAuthToken(accessToken);
                api.defaults.headers.common['Authorization'] = 'Bearer ' + accessToken;
                originalRequest.headers = originalRequest.headers || {};
                originalRequest.headers['Authorization'] = 'Bearer ' + accessToken;
                processQueue(null, accessToken);
                return api(originalRequest);
            } catch (err) {
                processQueue(err as AxiosError, null);
                clearAuthToken();
                clearRefreshToken();
                window.location.href = '/login';
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default api;
