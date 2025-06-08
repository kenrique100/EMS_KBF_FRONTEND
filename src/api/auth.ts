import api from '@/config/axios';
import { jwtDecode } from 'jwt-decode';

export interface User {
    id: string;
    username: string;
    name: string;
    role: 'ADMIN' | 'USER';
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    user: User;
}

export const login = async (username: string, password: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', { username, password });
    return response.data;
};

export const refreshToken = async (token: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/refresh', { refreshToken: token });
    return response.data;
};

export const logout = async (): Promise<void> => {
    try {
        await api.post('/auth/logout');
    } finally {
        // Always clear tokens even if logout API fails
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    }
};

export const validateToken = (token: string): boolean => {
    try {
        const decoded = jwtDecode<{ exp: number }>(token);
        return decoded.exp * 1000 > Date.now();
    } catch {
        return false;
    }
};